from flask import Blueprint, request, jsonify, make_response
from app.database.db_functions import signup_driver, login_driver, create_session, get_current_user, logout, set_driver_active, driver_kyc
import secrets
import cloudinary.uploader

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
        active = set_driver_active(email)
        if active['bool'] and active['verified']:
            message = "Driver now active."
        elif active['bool'] and not active['verified']:
            message = "Driver is not verified. Please complete KYC to become active."
        else:
            message = "Failed to set driver active."
        result['verified_message'] = message
        result['verified'] = active['verified']
        print(result) ###### Debugging
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
    
    vehicle_type = request.form.get("vehicle_type")
    license_plate = request.form.get("license_plate")
    bank_name = request.form.get("bank_name")
    account_number = request.form.get("account_number")
    account_name = request.form.get("account_name")

    if not all([vehicle_type, license_plate, bank_name, account_number, account_name]):
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "All KYC fields are required."}), 400
    
    proflie_picture = request.files.get("profile_picture")
    if not proflie_picture:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Profile picture is required."}), 400
    
    try:
        upload_result = cloudinary.uploader.upload(proflie_picture, 
                                                   folder="farmdrive",
                                                   useFilename=True,
                                                   unique_filename=True)
        profile_picture_url = upload_result.get("secure_url", "")
    except Exception as e:
        return jsonify({"status": "ERROR",
                        "message": f"Error uploading profile picture: {e}",
                        "code": 500})
    
    result = driver_kyc(driver_id, vehicle_type, license_plate, bank_name, account_number, account_name, profile_picture_url)

    return jsonify(result), result['code']


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
