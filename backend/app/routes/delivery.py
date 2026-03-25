from flask import Blueprint, request, jsonify
from app.database.db_functions import get_current_user, fetch_accepted_delivery_for_driver, fetch_accepted_delivery_for_farmer

delivery_bp = Blueprint("delivery_bp", __name__, url_prefix="/api/v1")

@delivery_bp.route("/delivery", methods=['GET'])
def fetch_accepted_delivery():
    farmer_id = get_current_user(
        request.cookies.get('farmer_session_id'), "farmer")
    driver_id = get_current_user(
        request.cookies.get('driver_session_id'), "driver")

    requested_role = request.args.get("role")

    if requested_role == 'farmer' and farmer_id:
        result = fetch_accepted_delivery_for_farmer(farmer_id)
        return jsonify(result), result['code']

    if requested_role == 'driver' and driver_id:
        result = fetch_accepted_delivery_for_driver(driver_id)
        return jsonify(result), result['code']

    if driver_id:
        return jsonify(fetch_accepted_delivery_for_driver(driver_id))
    if farmer_id:
        return jsonify(fetch_accepted_delivery_for_farmer(farmer_id))

    return jsonify({"status": "ERROR",
                    "code": 401,
                    "message": "User is unauthorized."})
