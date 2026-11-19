---
title: 'Video Calls in a Django App with Self-Hosted Jitsi and JWT'
description: 'How to add secure one-to-one video calls to a Django REST Framework backend using a self-hosted Jitsi Meet server, short-lived JWT room tokens and Celery for call notifications.'
date: 2026-11-20
tags: [django, drf, jitsi, jwt, celery, video]
draft: false
---

Some products need video calls without asking users to install anything or create an account somewhere else. A family calling a grandparent on a dedicated Android box is a good example: the person receiving the call should not have to type a link, pick a room or log in. The backend decides who calls whom, and the device just opens the call.

A self-hosted [Jitsi Meet](https://jitsi.github.io/handbook/) server handles the media. Django stays in charge of who is allowed into which room. This post walks through that split.

## Why self-host Jitsi

The public `meet.jit.si` service is open to anyone who knows the room name. For calls between family members that is not acceptable. Running your own Jitsi with **token authentication** means:

- only users your backend has signed a token for can join a room,
- room names can stay random and unguessable,
- the call never depends on a third-party account.

Jitsi's Prosody component validates a JWT signed with a shared secret. Django holds the same secret and issues the tokens.

## Issuing a room token from Django

Install PyJWT and keep the Jitsi settings in your Django settings:

```python
# settings.py
JITSI_DOMAIN = env("JITSI_DOMAIN")        # e.g. meet.example.com
JITSI_APP_ID = env("JITSI_APP_ID")        # must match Prosody's app_id
JITSI_APP_SECRET = env("JITSI_APP_SECRET")
JITSI_TOKEN_TTL = 120                      # seconds: only needs to cover joining
```

A small helper builds the token Jitsi expects:

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

Keep the lifetime short. The token is only checked when the participant joins, so it does not cut an ongoing call when it expires.

## The call endpoint

The client never chooses the room. It asks the API to start a call with a contact, and the API checks the relationship before returning anything:

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

`get_object_or_404(..., owner=request.user)` is the access check: a user can only call someone in their own contact list.

## Ringing the device with Celery

The person being called needs to know about it quickly, but the HTTP request that starts the call should not wait for a push service. A Celery task sends the notification, and retries if the push provider is briefly down:

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

The callee gets its own token, signed for its own identity, so each side shows up in the call under the right name.

## On the device

The Android app receives the push, opens the Jitsi Meet SDK with the domain, room and token, and joins straight away. For a device meant for elderly users, that is the whole point: one notification, one tap (or none, with auto-answer for trusted contacts), and the family is on screen.

## Things worth getting right

- **Never expose the secret** to clients. Only the backend signs tokens.
- **Random room names** (`secrets.token_urlsafe`) so a room cannot be guessed even if token auth were misconfigured.
- **Record call state** (`ringing`, `answered`, `missed`) in the `Call` model so families can see missed calls.
- **Keep TURN configured** on the Jitsi server. Home networks behind strict NATs will fail without it.

Django does what it is good at, users, permissions and business rules, and Jitsi does the real-time media. The JWT is the small contract between the two.
