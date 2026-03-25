from flask_socketio import SocketIO

# We initialize without the app first
socketio = SocketIO(cors_allowed_origins="*")