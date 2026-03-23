from flask import Blueprint, request, jsonify, make_response
from app.database.db_functions import signup_driver, login_driver, create_session, get_current_user, logout
import secrets

driver_auth_bp = Blueprint("driver_auth_bp", __name__,
                           url_prefix="/api/v1/driver/auth")


@driver_auth_bp.route("/signup", methods=["POST"])
def sign_up():
    if request.method != 'POST':
        return jsonify({"status": "ERROR",
                        "code": 405,
                        "message": "This method is not allowed for this route."})

    data = request.json.get("driverDetails", {})
    if not data:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Driver details are required."})

    email = data.get("email")
    first_name = data.get("firstname")
    last_name = data.get("surname")
    phone = data.get("phone")
    password = data.get("password")

    if not all([email, first_name, last_name, phone, password]):
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Incomplete fields provided."})

    result = signup_driver(email, first_name, last_name, phone, password)
    return jsonify(result), result["code"]


@driver_auth_bp.route("/login", methods=["POST"])
def log_in():
    data = request.json.get("driverDetails", {})
    if not data:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Driver credentials are required."})

    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Credentials are required."})

    result = login_driver(email, password)
    if result['code'] == 200:
        session_id = secrets.token_hex(32)
        create_session(session_id, result['id'], "driver")

        response = make_response(jsonify(result))
        response.set_cookie('driver_session_id',
                            session_id,
                            path='/',
                            httponly=True,
                            secure=False,
                            samesite='Lax',
                            max_age=86400
                            )
        return response, 200

    return jsonify(result), result['code']


@driver_auth_bp.route("/kyc", methods=["POST"])
def submit_kyc():
    driver_id = get_current_user(
        request.cookies.get('driver_session_id'), "driver")
    if not driver_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401

    # KYC submission logic would go here
    return jsonify({"status": "OK",
                    "code": 200,
                    "message": "KYC submitted successfully."}), 200


@driver_auth_bp.route("/logout", methods=["POST"])
def log_out():
    driver_id = get_current_user(
        request.cookies.get('driver_session_id'), "driver")
    if not driver_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401

    result = logout(driver_id, "driver")
    if result['code'] == 200:
        response = make_response(jsonify(result))
        response.delete_cookie('driver_session_id', path='/')
        return response, 200

    return jsonify(result), result['code']
