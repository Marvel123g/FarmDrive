from flask import Blueprint, jsonify, request
from app.database.db_functions import save_produce_details, get_current_user

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
    
    # result = save_produce_details(farmer_id, crop_name, pickup_location, destination, quantity, details)

    location_data = request.json.get("farmerLocation")
    if not location_data:
        return jsonify({"status": "ERROR", 
                        "code": 400,
                        "message": "Farmer location not provided."})
    
    farm_lat = location_data.get("lat", "")
    farm_lng = location_data.get("lng", "")
