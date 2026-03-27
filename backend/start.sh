#!/bin/bash
# Initialize the database
python -c "from app.database.db import init_db; init_db()"

# Start Gunicorn with 4 eventlet workers for SocketIO support
exec gunicorn --workers 1 --worker-class eventlet --bind 0.0.0.0:10000 main:app