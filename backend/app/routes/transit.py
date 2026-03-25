from flask import Blueprint, request, jsonify
from app.database.db_functions import update_delivery_status, get_current_user, request_payment
from app.sockets.socket_events import emit_status_update

transit_bp = Blueprint("transit_bp", __name__, url_prefix="/api/v1/transit")


# 1. Triggered when the driver leaves the farm with the goods
@transit_bp.route("/start", methods=["POST"])
def start_transit():
    driver_id = get_current_user(
        request.cookies.get('driver_session_id'), "driver")
    if not driver_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401

    delivery_id = request.json.get("delivery_id")
    if not delivery_id:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Delivery ID not provided."}), 400

    # We use your existing function!
    result = update_delivery_status(delivery_id, driver_id, "IN_TRANSIT")
    if result['code'] == 200:
        emit_status_update(delivery_id, "IN_TRANSIT")
    return jsonify(result), result["code"]


# 2. Triggered when the driver reaches the final destination
@transit_bp.route("/complete", methods=["POST"])
def complete_delivery():
    driver_id = get_current_user(
        request.cookies.get('driver_session_id'), "driver")
    if not driver_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401

    delivery_id = request.json.get("delivery_id")
    if not delivery_id:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Delivery ID not provided."}), 400

    # We use your existing function again!
    result = update_delivery_status(delivery_id, driver_id, "DELIVERED")

    if result["code"] != 200:
        return jsonify(result), result["code"]

    payment_result = request_payment(driver_id, delivery_id)
    return jsonify(payment_result), payment_result['code']
