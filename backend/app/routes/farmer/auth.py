from flask import Blueprint, request, jsonify, make_response
from app.database.db_functions import signup_farmer, login_farmer, create_session, get_current_user, logout
import secrets

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


@farmer_auth_bp.route("/login", methods=["POST"])
def log_in():
    if request.method != 'POST':
        return jsonify({"status": "ERROR",
                        "code": 405,
                        "message": "This method is not allowed for this route."})

    data = request.json.get("farmerDetails", {})
    if not data:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Farmer credentials are required."})
    
    phone = data.get("phone")
    password = data.get("password")

    if not all([phone, password]):
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Credentials are required."})

    result = login_farmer(phone, password)
    if result['code'] == 200:
        session_id = secrets.token_hex(32)
        create_session(session_id, result['id'], "farmer")

        response = make_response(jsonify(result))
        response.set_cookie('farmer_session_id',
                            session_id,
                            httponly=True,
                            secure=False,
                            samesite='Lax',
                            max_age=86400
                            )
        return response, 200

    return jsonify(result), result['code']


@farmer_auth_bp.route("/logout", methods=["POST"])
def log_out():
    if request.method != 'POST':
        return jsonify({"status": "ERROR",
                        "code": 405,
                        "message": "This method is not allowed for this route."})
    
    farmer_id = get_current_user(request.cookies.get('farmer_session_id'), "farmer")
    if not farmer_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401
    
    result = logout(farmer_id, "farmer")
    if result['code'] == 200:
        response = make_response(jsonify(result))
        response.delete_cookie('farmer_session_id')
        return response, 200
    
    return jsonify(result), result['code']