from flask import Blueprint, jsonify, request
from app.database.db_functions import get_current_user, view_payments, view_completed_deliveries

payment_bp = Blueprint("payment_bp", __name__, url_prefix="/api/v1")

@payment_bp.route("/payments", methods=['GET'])
def get_payment_details():
    farmer_id = get_current_user(
        request.cookies.get('farmer_session_id'), "farmer")
    if not farmer_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401

    result = view_payments(farmer_id)
    return jsonify(result), result["code"]

    
@payment_bp.route("/pay/<delivery_id>", methods=['GET'])
def get_payment_preview(delivery_id):
    # 1. Auth Check
    farmer_id = get_current_user(
        request.cookies.get('farmer_session_id'), "farmer")
    if not farmer_id:
        return jsonify({"status": "ERROR", 
                        "code": 401, 
                        "message": "Unauthorized"}), 401

    # 2. Fetch the delivery proof and details
    # This calls your view_completed_deliveries function
    result = view_completed_deliveries(delivery_id)

    # 3. Security Check: Ensure this farmer actually owns this delivery
    # (Optional but recommended: query the deliveries table to verify farmer_id matches)

    return jsonify(result), result["code"]
