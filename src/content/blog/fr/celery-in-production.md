---
title: 'Celery en production : les réglages qui évitent de perdre des tâches'
description: "Configuration Celery concrète pour Django en production : acquittement tardif, tâches idempotentes, retries avec backoff, limites de temps, mise en file après commit et files séparées."
date: 2026-11-20
tags: [python, django, celery, redis, background-jobs]
lang: fr
draft: false
---

Celery fonctionne tout seul en développement. En production, les réglages par défaut laissent des tâches disparaître sans bruit quand un worker redémarre, s'exécuter deux fois sans prévenir, ou rester bloquées indéfiniment. Rien de tout ça ne se voit avant que de vrais utilisateurs attendent un e-mail, une notification ou un transcodage vidéo.

Voici les réglages et les habitudes que j'applique à chaque projet Django qui utilise Celery.

## 1. Acquitter les tâches après leur exécution, pas avant

Par défaut, un worker acquitte une tâche dès qu'il la récupère. Si le worker est tué en pleine exécution (un déploiement, un manque de mémoire), la tâche est perdue.

```python
# settings.py (avec app.config_from_object("django.conf:settings", namespace="CELERY"))
CELERY_TASK_ACKS_LATE = True
CELERY_TASK_REJECT_ON_WORKER_LOST = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
```

Avec l'acquittement tardif, une tâche interrompue retourne dans la file. Un prefetch de 1 empêche un worker occupé de garder une pile de tâches que d'autres workers pourraient traiter.

Le prix à payer : une tâche peut maintenant s'exécuter **plusieurs fois**. D'où la règle suivante.

## 2. Rendre chaque tâche idempotente

Exécuter une tâche deux fois ne doit pas envoyer deux e-mails ni débiter deux fois. Passez des identifiants, pas des objets, et vérifiez l'état avant d'agir :

```python
@shared_task
def send_welcome_email(user_id):
    user = User.objects.get(pk=user_id)
    if user.welcome_sent_at:
        return  # déjà fait lors d'une exécution précédente
    send_mail(...)
    User.objects.filter(pk=user_id).update(welcome_sent_at=timezone.now())
```

Passer `user_id` plutôt qu'un objet `User` garantit aussi que la tâche lit des données à jour, et non une copie figée au moment de la mise en file.

## 3. Mettre en file seulement après le commit

Une situation de concurrence classique : la vue crée une ligne et met une tâche en file dans la même transaction. Le worker récupère la tâche avant le commit et ne trouve pas la ligne.

```python
from django.db import transaction

def create_order(request):
    order = Order.objects.create(...)
    transaction.on_commit(lambda: process_order.delay(order.pk))
```

`on_commit` ne met la tâche en file qu'une fois les données réellement en base, et pas du tout si la transaction est annulée.

## 4. Réessayer les erreurs qui valent la peine

Les services externes tombent brièvement. Laissez Celery réessayer avec un backoff exponentiel au lieu d'échouer au premier timeout :

```python
@shared_task(
    autoretry_for=(requests.ConnectionError, requests.Timeout),
    retry_backoff=True,
    retry_backoff_max=600,
    retry_jitter=True,
    max_retries=5,
)
def push_to_device(device_id, payload):
    ...
```

Ne listez que les erreurs qu'un nouvel essai peut corriger. Une erreur de validation échouera cinq fois de la même manière.

## 5. Mettre une limite de temps partout

Une tâche bloquée sur un appel réseau occupe un worker pour toujours. Fixez des limites globales et surchargez-les pour les longs traitements :

```python
CELERY_TASK_SOFT_TIME_LIMIT = 60   # lève SoftTimeLimitExceeded dans la tâche
CELERY_TASK_TIME_LIMIT = 90        # arrêt forcé au-delà
```

La limite souple laisse à la tâche le temps de nettoyer. Un transcodage vidéo peut déclarer ses propres limites, plus longues, avec `@shared_task(soft_time_limit=1800, time_limit=1900)`.

## 6. Vérifier le visibility timeout de Redis

Avec Redis comme broker et l'acquittement tardif, une tâche non acquittée avant la fin du **visibility timeout** est confiée à un autre worker. La valeur par défaut est d'une heure. Si une tâche peut durer plus longtemps, ou utilise un `countdown`/`eta` lointain, augmentez-le :

```python
CELERY_BROKER_TRANSPORT_OPTIONS = {"visibility_timeout": 4 * 3600}
```

Sinon, les longues tâches commencent à s'exécuter deux fois, ce qui est difficile à repérer.

## 7. Séparer les files par urgence

Avec une seule file, une rafale de traitements lents (rapports, transcodages) retarde les tâches rapides (notifications, réinitialisations de mot de passe).

```python
CELERY_TASK_ROUTES = {
    "notifications.tasks.*": {"queue": "realtime"},
    "media.tasks.*": {"queue": "heavy"},
}
```

```bash
celery -A project worker -Q realtime --concurrency 8
celery -A project worker -Q heavy --concurrency 2
```

Chaque file a des workers dimensionnés pour son travail, et un traitement lent ne peut plus bloquer une notification d'appel.

## 8. Surveiller

Utilisez [Flower](https://flower.readthedocs.io/) ou exportez des métriques, et alertez sur deux chiffres : **la longueur des files** et **le taux d'échec des tâches**. Une file qui ne cesse de grossir signifie qu'il faut plus de workers, ou qu'une tâche bloquée les occupe.

---

Aucun de ces réglages n'est exotique, mais ensemble ils font passer Celery de « ça marche en général » à un outil sur lequel on peut compter quand un déploiement redémarre les workers en pleine journée.
