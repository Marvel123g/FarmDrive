# from .socket_manager import socketio
# from flask_socketio import join_room, emit
# from app.routes.driver.position import update_driver_position


# @socketio.on('join_delivery')
# def on_join(data):
#     # Data should be {'delivery_id': 123}
#     delivery_id = str(data.get('delivery_id'))
#     join_room(delivery_id)
#     print(f"User joined delivery room: {delivery_id}")


# @socketio.on('update_location')
# def handle_location(data):
#     # Data: { 'delivery_id': 1, 'driver_id': 'D1', 'lat': 6.5, 'lng': 3.4 }
#     delivery_id = str(data.get('delivery_id'))
#     driver_id = data.get('driver_id')
#     lat = data.get('lat')
#     lng = data.get('lng')

#     # 1. Update the SQLite database so the position is saved
#     update_driver_position(driver_id, lat, lng)

#     # 2. Push the movement to the Farmer in the room
#     emit('driver_moved', {
#         'lat': lat,
#         'lng': lng
#     }, to=delivery_id)
