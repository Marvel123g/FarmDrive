from flask import Blueprint, request, jsonify
from app.database.db_functions import signup_farmer

farmer_auth_bp = Blueprint("farmer_auth_bp", __name__, url_prefix="/api/v1/farmer/auth")

@farmer_auth_bp.route("/signup", methods=["POST"])
def sign_up():
    if request.method != 'POST':
        return jsonify({"status": "ERROR",
                        "code": 405,
                        "message": "This method is not allowed for this route."})
    
    data = request.json.get("farmerDetails", {})
    if not data:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Farmer details are required."})
    
    first_name = data.get("firstname")
    last_name = data.get("surname")
    phone = data.get("phone")
    farm_state = data.get("farm_state")
    farm_city = data.get("farm_city")
    password = data.get("password")

    if not all([first_name, last_name, phone, farm_state, farm_city, password]):
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Incomplete fields provided."})
    
    result = signup_farmer(first_name, last_name, phone, farm_state, farm_city, password)
    return jsonify(result), result["code"]