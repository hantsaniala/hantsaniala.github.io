---
title: 'Celery in Production: Settings and Habits That Prevent Lost Tasks'
description: 'Practical Celery configuration for Django in production: late acknowledgement, idempotent tasks, retries with backoff, time limits, transaction-safe enqueueing and separate queues.'
date: 2026-11-20
tags: [python, django, celery, redis, background-jobs]
draft: false
---

Celery works out of the box in development. In production, the defaults let tasks disappear silently when a worker restarts, run twice when you did not expect it, or hang forever. None of that shows up until real users are waiting for an email, a notification or a video transcode.

These are the settings and habits I apply to every Django project that runs Celery.

## 1. Acknowledge tasks after they run, not before

By default a worker acknowledges a task as soon as it picks it up. If the worker is killed mid-task (a deploy, an out-of-memory kill), that task is gone.

```python
# settings.py (with app.config_from_object("django.conf:settings", namespace="CELERY"))
CELERY_TASK_ACKS_LATE = True
CELERY_TASK_REJECT_ON_WORKER_LOST = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
```

With late acknowledgement, an interrupted task goes back to the queue. A prefetch of 1 stops one busy worker from holding a stack of tasks that other workers could be running.

The price: a task can now run **more than once**. That leads to the next rule.

## 2. Make every task idempotent

Running a task twice must not send two emails or charge twice. Pass IDs, not objects, and check state before acting:

```python
@shared_task
def send_welcome_email(user_id):
    user = User.objects.get(pk=user_id)
    if user.welcome_sent_at:
        return  # already done on a previous run
    send_mail(...)
    User.objects.filter(pk=user_id).update(welcome_sent_at=timezone.now())
```

Passing `user_id` instead of a `User` also means the task always reads fresh data, not a snapshot from when it was queued.

## 3. Enqueue only after the transaction commits

A classic race: the view creates a row and queues a task inside the same transaction. The worker picks the task up before the commit and cannot find the row.

```python
from django.db import transaction

def create_order(request):
    order = Order.objects.create(...)
    transaction.on_commit(lambda: process_order.delay(order.pk))
```

`on_commit` queues the task only once the data is really in the database, and not at all if the transaction rolls back.

## 4. Retry the failures that are worth retrying

External services fail briefly. Let Celery retry with exponential backoff instead of failing on the first timeout:

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

Only list errors that a retry can fix. A validation error will fail the same way five times.

## 5. Put a time limit on everything

A task stuck on a network call holds a worker slot forever. Set global limits and override them for long jobs:

```python
CELERY_TASK_SOFT_TIME_LIMIT = 60   # raises SoftTimeLimitExceeded inside the task
CELERY_TASK_TIME_LIMIT = 90        # hard kill after this
```

The soft limit gives the task a chance to clean up. A video transcode can declare its own, longer limits with `@shared_task(soft_time_limit=1800, time_limit=1900)`.

## 6. Check the Redis visibility timeout

With Redis as the broker and late acknowledgement, a task that is not acknowledged within the **visibility timeout** is handed to another worker. The default is one hour. If any task can run longer, or uses a long `countdown`/`eta`, raise it:

```python
CELERY_BROKER_TRANSPORT_OPTIONS = {"visibility_timeout": 4 * 3600}
```

Otherwise long tasks start running twice, which is hard to spot.

## 7. Separate queues by urgency

One queue means a burst of slow jobs (reports, transcodes) delays the fast ones (notifications, password resets).

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

Each queue gets workers sized for its work, and a slow job can no longer block a call notification.

## 8. Watch it

Run [Flower](https://flower.readthedocs.io/) or export metrics, and alert on two numbers: **queue length** and **task failure rate**. A queue that keeps growing means you need more workers or a stuck task is holding them.

---

None of these settings are exotic, but together they turn Celery from "usually works" into something you can rely on when a deploy restarts workers in the middle of the day.
