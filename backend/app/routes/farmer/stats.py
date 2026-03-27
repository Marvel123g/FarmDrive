from flask import Blueprint, request, jsonify
from app.database.db_functions import get_current_user, farmer_stats

fstats_bp = Blueprint("fstats_bp", __name__, url_prefix="/api/v1/farmer/stats")


@fstats_bp.route("/", methods=['GET'])
def get_stats():
    farmer_id = get_current_user(
        request.cookies.get('farmer_session_id'), "farmer")

    if not farmer_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "User is unauthorized."})

    result = farmer_stats(farmer_id)
    return jsonify(result), result["code"]
