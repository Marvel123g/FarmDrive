from flask import Blueprint, jsonify

health_bp = Blueprint("health_bp", __name__, url_prefix="/api/v1")

@health_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "SUCCESS",
                    "code": 200,
                    "message": "Server is alive"}), 200