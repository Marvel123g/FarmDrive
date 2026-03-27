#!/bin/bash
# Initialize the database
python -c "from app.database.db import init_db; init_db()"

# Start Gunicorn with 4 eventlet workers for SocketIO support
exec gunicorn --workers 4 --worker-class eventlet --bind 0.0.0.0:5000 main:create_app