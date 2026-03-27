from flask import request, jsonify
from .socket_manager import socketio
from flask_socketio import join_room, emit
from app.database.db_functions import update_driver_position, get_current_user


@socketio.on('join_delivery')
def on_join(data):
    # Standardise delivery_id to string to match room naming
    delivery_id = str(data.get('delivery_id'))
    if delivery_id:
        join_room(delivery_id)
        print(f"User joined delivery room: {delivery_id}")


@socketio.on('update_location')
def handle_location(data):
    driver_id = get_current_user(
        request.cookies.get('driver_session_id'), "driver")
    if not driver_id:
        emit('error', {"message": "Unauthorized socket connection."})
        return

    delivery_id = str(data.get('delivery_id'))
    lat = data.get('lat')
    lng = data.get('lng')

    # 1. Validation: Don't process if coordinates are missing
    if not all([lat, lng, driver_id, delivery_id]):
        return

    # 2. Update the SQLite database
    # This keeps the "Last Seen" position accurate even if the farmer is offline
    result = update_driver_position(driver_id, lat, lng)

    if result.get('code') == 200:
        # 3. Push to the Farmer in the room
        # Include include_self=False so the driver doesn't receive their own echo
        emit('driver_moved', {
            'lat': lat,
            'lng': lng
        }, to=delivery_id, include_self=False)
    else:
        print(
            f"Position update failed for {driver_id}: {result.get('message')}")


def emit_status_update(delivery_id, new_status):
    """
    Call this from your Flask routes (e.g., in the 'Mark as Delivered' route)
    """
    socketio.emit('status_update', {
        'status': new_status,
        'message': f"Delivery status: {new_status}"
    }, to=str(delivery_id))
