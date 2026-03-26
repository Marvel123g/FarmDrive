from flask import Blueprint, request, jsonify
from app.database.db_functions import get_current_user, driver_stats

stats_bp = Blueprint("stats_bp", __name__, url_prefix="/api/v1/driver/stats")

@stats_bp.route("/", methods=['GET'])
def get_stats():
    driver_id = get_current_user(
        request.cookies.get('driver_session_id'), "driver")

    if not driver_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "User is unauthorized."})
    
    result = get_stats(driver_id)
    return jsonify(result), result["code"]