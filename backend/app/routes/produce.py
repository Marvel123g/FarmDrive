from flask import Blueprint, jsonify, request
from app.database.db_functions import save_produce_details, get_current_user, update_farmer_position, get_all_produce

produce_bp = Blueprint("produce_bp", __name__, url_prefix="/api/v1")


@produce_bp.route("/produce", methods=['POST'])
def addProduce():
    farmer_id = get_current_user(
        request.cookies.get('farmer_session_id'), "farmer")
    if not farmer_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401

    data = request.json.get("produceDetails", {})
    if not data:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Produce details are required."})

    crop_name = data.get("crop", "")
    pickup_location = data.get("from", "")
    destination = data.get("to", "")
    quantity = data.get("quantity", "")
    details = data.get("description", "")

    if not all([crop_name, pickup_location, destination, quantity]):
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Incomplete data provided for produce upload."})

    location_data = request.json.get("farmerLocation")
    if not location_data:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Farmer location not provided."})

    farm_lat = location_data.get("lat", "")
    farm_lng = location_data.get("lng", "")

    if not all([farm_lat, farm_lng]):
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Farm location details are incomplete."})

    result = update_farmer_position(farmer_id, farm_lat, farm_lng)

    if result["code"] == 200:
        result2 = save_produce_details(
            farmer_id, crop_name, pickup_location, destination, quantity, details)
        return jsonify(result2), result2['code']

    return jsonify(result), result['code']


@produce_bp.route("/produce", methods=['GET'])
def fetch_produce():
    farmer_sid = request.cookies.get('farmer_session_id')
    user_id = get_current_user(farmer_sid, "farmer")
    role = "farmer"

    # 2. If not a farmer, try to get the driver
    if not user_id:
        driver_sid = request.cookies.get('driver_session_id')
        user_id = get_current_user(driver_sid, "driver")
        role = "driver"

    if not user_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "User is unauthorized."})

    result = get_all_produce()

    return jsonify(result), result['code']
