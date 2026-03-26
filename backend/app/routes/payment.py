from flask import Blueprint, jsonify, request
from app.database.db_functions import get_current_user

payment_bp = Blueprint("payment_bp", __name__, url_prefix="/api/v1")

@payment_bp.route("/pay", methods=['GET'])
def get_payment_details():
    farmer_id = get_current_user(
        request.cookies.get('farmer_session_id'), "farmer")
    if not farmer_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401

    
    
    
