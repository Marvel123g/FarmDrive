# from flask import Blueprint, request, jsonify
# from app.database.db_functions import update_driver_position, get_driver_position

# dpos_auth_bp = Blueprint("dpos_auth_bp", __name__, url_prefix="/api/v1/driver")


# @dpos_auth_bp.route("/position", methods=["POST"])
# def setPosition():
#     if not request.json.get("positionDetails"):
#         return jsonify({"error": "No data provided"}), 400

#     positionDetails = request.json.get("positionDetails")
#     driver_id = positionDetails.get("driver_id", "")
#     latitude = positionDetails.get("lat", "")
#     longitude = positionDetails.get("lng", "")

#     if not driver_id or not latitude or not longitude:
#         return jsonify({"error": "Missing driver position details"}), 400

#     returnValue = update_driver_position(driver_id, latitude, longitude)
#     return jsonify(returnValue), returnValue["code"]


# @dpos_auth_bp.route("/position/<driver_id>", methods=["GET"])
# def getPosition(driver_id):
#     if not driver_id:
#         return jsonify({"error": "No DRIVER ID provided"}), 400

#     returnValue = get_driver_position(driver_id)
#     return jsonify(returnValue), returnValue["code"]
