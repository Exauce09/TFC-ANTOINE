#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
while ! python -c "import socket; s=socket.socket(); s.connect(('db', 5432))" 2>/dev/null; do
  sleep 1
done

python manage.py migrate
python manage.py seed_demo
python manage.py collectstatic --noinput

exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2
