---
title: 'Appels vidéo dans une app Django avec Jitsi auto-hébergé et JWT'
description: "Ajouter des appels vidéo sécurisés à un backend Django REST Framework avec un serveur Jitsi Meet auto-hébergé, des jetons JWT de courte durée et Celery pour les notifications d'appel."
date: 2026-11-20
tags: [django, drf, jitsi, jwt, celery, video]
lang: fr
draft: false
---

Certains produits ont besoin d'appels vidéo sans demander aux utilisateurs d'installer quoi que ce soit ni de créer un compte ailleurs. Une famille qui appelle un grand-parent sur une box Android dédiée en est un bon exemple : la personne qui reçoit l'appel ne doit ni taper un lien, ni choisir une salle, ni se connecter. Le backend décide qui appelle qui, et l'appareil se contente d'ouvrir l'appel.

Un serveur [Jitsi Meet](https://jitsi.github.io/handbook/) auto-hébergé gère les flux audio et vidéo. Django reste maître de qui a le droit d'entrer dans quelle salle. Cet article détaille ce partage des rôles.

## Pourquoi auto-héberger Jitsi

Le service public `meet.jit.si` est ouvert à toute personne qui connaît le nom de la salle. Pour des appels entre membres d'une famille, ce n'est pas acceptable. Faire tourner votre propre Jitsi avec **l'authentification par jeton** signifie :

- seuls les utilisateurs pour lesquels votre backend a signé un jeton peuvent rejoindre une salle,
- les noms de salle restent aléatoires et impossibles à deviner,
- l'appel ne dépend jamais d'un compte tiers.

Le composant Prosody de Jitsi valide un JWT signé avec un secret partagé. Django détient le même secret et émet les jetons.

## Émettre un jeton de salle depuis Django

Installez PyJWT et gardez la configuration Jitsi dans vos settings Django :

```python
# settings.py
JITSI_DOMAIN = env("JITSI_DOMAIN")        # ex. meet.example.com
JITSI_APP_ID = env("JITSI_APP_ID")        # doit correspondre à l'app_id de Prosody
JITSI_APP_SECRET = env("JITSI_APP_SECRET")
JITSI_TOKEN_TTL = 120                      # secondes : il suffit de couvrir l'entrée dans la salle
```

Une petite fonction construit le jeton attendu par Jitsi :

```python
# calls/jitsi.py
import time
import jwt
from django.conf import settings


def room_token(room: str, user) -> str:
    now = int(time.time())
    payload = {
        "aud": "jitsi",
        "iss": settings.JITSI_APP_ID,
        "sub": settings.JITSI_DOMAIN,
        "room": room,
        "iat": now,
        "exp": now + settings.JITSI_TOKEN_TTL,
        "context": {"user": {"id": str(user.pk), "name": user.get_full_name()}},
    }
    return jwt.encode(payload, settings.JITSI_APP_SECRET, algorithm="HS256")
```

Gardez une durée de vie courte. Le jeton n'est vérifié qu'au moment où le participant rejoint la salle : son expiration ne coupe donc pas un appel en cours.

## L'endpoint d'appel

Le client ne choisit jamais la salle. Il demande à l'API de lancer un appel avec un contact, et l'API vérifie la relation avant de renvoyer quoi que ce soit :

```python
# calls/views.py
import secrets
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .jitsi import room_token
from .models import Call, Contact
from .tasks import notify_callee


class StartCallView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, contact_id):
        contact = get_object_or_404(Contact, pk=contact_id, owner=request.user)
        call = Call.objects.create(
            caller=request.user,
            callee=contact.user,
            room=secrets.token_urlsafe(16),
        )
        notify_callee.delay(call.pk)
        return Response(
            {"room": call.room, "domain": settings.JITSI_DOMAIN,
             "token": room_token(call.room, request.user)},
            status=status.HTTP_201_CREATED,
        )
```

`get_object_or_404(..., owner=request.user)` est le contrôle d'accès : un utilisateur ne peut appeler que quelqu'un de sa propre liste de contacts.

## Faire sonner l'appareil avec Celery

La personne appelée doit être prévenue vite, mais la requête HTTP qui lance l'appel ne doit pas attendre un service de push. Une tâche Celery envoie la notification, et réessaie si le fournisseur de push est brièvement indisponible :

```python
# calls/tasks.py
from celery import shared_task

from .jitsi import room_token
from .models import Call
from .push import PushError, send_push


@shared_task(autoretry_for=(PushError,), retry_backoff=True, max_retries=3)
def notify_callee(call_id):
    call = Call.objects.select_related("callee").get(pk=call_id)
    send_push(call.callee, {
        "type": "incoming_call",
        "room": call.room,
        "token": room_token(call.room, call.callee),
    })
```

La personne appelée reçoit son propre jeton, signé pour sa propre identité : chacun apparaît donc dans l'appel sous le bon nom.

## Sur l'appareil

L'app Android reçoit le push, ouvre le SDK Jitsi Meet avec le domaine, la salle et le jeton, et rejoint l'appel directement. Pour un appareil destiné à des personnes âgées, c'est tout l'intérêt : une notification, un appui (ou aucun, avec la réponse automatique pour les contacts de confiance), et la famille est à l'écran.

## Les points à soigner

- **Ne jamais exposer le secret** aux clients. Seul le backend signe les jetons.
- **Des noms de salle aléatoires** (`secrets.token_urlsafe`), pour qu'une salle reste impossible à deviner même si l'authentification par jeton était mal configurée.
- **Enregistrer l'état de l'appel** (`ringing`, `answered`, `missed`) dans le modèle `Call`, pour que la famille voie les appels manqués.
- **Garder un serveur TURN configuré** côté Jitsi. Les réseaux domestiques derrière des NAT stricts échoueront sans lui.

Django fait ce qu'il fait de mieux, utilisateurs, permissions et règles métier, et Jitsi gère le temps réel. Le JWT est le petit contrat entre les deux.
