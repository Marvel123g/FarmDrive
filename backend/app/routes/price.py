from flask import Blueprint, request, jsonify
from app.database.db_functions import get_current_user, set_price_by_driver, update_driver_position, fetch_prices_for_produce, accept_price_for_produce
from app.math.distance import calculate_initial_driver_distance_from_farmer

price_bp = Blueprint("price_bp", __name__, url_prefix="/api/v1")

@price_bp.route("/price", methods=['POST'])
def set_price():
    driver_id = get_current_user(
        request.cookies.get('driver_session_id'), "driver")
    if not driver_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401

    priceData = request.json.get("priceDetails")
    driverLocation = request.json.get("driverLocation")
    if not priceData or not driverLocation:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Price details and driver location not provided."})

    # Price related
    produce_id = priceData.get("produce_id", "")
    price = priceData.get("price", "")

    if not all([produce_id, price]):
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Missing price details."})

    # Location related
    driver_lat = driverLocation.get("lat", "")
    driver_lng = driverLocation.get("lng", "")

    if not all([driver_lat, driver_lng]):
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Missing driver location details."})

    driver_distance = calculate_initial_driver_distance_from_farmer(driver_lat, driver_lng, produce_id)
    if driver_distance.get("status") == "ERROR":
        return jsonify(driver_distance), driver_distance['code']
    distance = driver_distance.get("distance")

    # If successful, update driver's location
    returnCode = update_driver_position(driver_id, driver_lat, driver_lng)
    if returnCode['code'] != 200:
        return jsonify(returnCode), returnCode['code']

    # If successful, set the driver's price with his distance from the farmer
    returnValue = set_price_by_driver(driver_id, produce_id, price, distance)
    if returnValue.get("status") == "ERROR":
        return jsonify(returnValue), returnValue["code"]  # Error setting price

    # If all is successful, return price has been set with a '200' status code
    return jsonify(returnValue), returnValue["code"]


@price_bp.route("/price/<produce_id>", methods=['GET'])
def get_prices(produce_id):
    farmer_id = get_current_user(request.cookies.get('farmer_session_id'),
                                 "farmer")
    if not farmer_id:
        return jsonify({
            "status": "ERROR",
            "code": 401,
            "message": "Unauthorized. Please log in."
        }), 401

    result = fetch_prices_for_produce(produce_id)
    return jsonify(result), result['code']


@price_bp.route("/price/accept", methods=['POST'])
def accept_price():
    farmer_id = get_current_user(request.cookies.get('farmer_session_id'),
                                 "farmer")
    if not farmer_id:
        return jsonify({
            "status": "ERROR",
            "code": 401,
            "message": "Unauthorized. Please log in."
        }), 401

    data = request.json.get("priceDetails")
    if not data:
        return jsonify({
            "status": "ERROR",
            "code": 400,
            "message": "Price details not provided."
        })

    produce_id = data.get("produce_id", "")
    driver_id = data.get("driver_id", "")

    if not all([produce_id, driver_id]):
        return jsonify({
            "status": "ERROR",
            "code": 400,
            "message": "Missing important IDs."
        })

    result = accept_price_for_produce(produce_id, driver_id)
    return jsonify(result), result['code']