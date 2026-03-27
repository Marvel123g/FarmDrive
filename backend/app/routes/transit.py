from flask import Blueprint, request, jsonify
from app.database.db_functions import update_delivery_status, get_current_user, request_payment, completed_delivery, time_ago
from app.sockets.socket_events import emit_status_update
from app.services.locationAI import get_destination_location
from datetime import datetime
import cloudinary

transit_bp = Blueprint("transit_bp", __name__, url_prefix="/api/v1/transit")


# 1. Triggered when the driver leaves the farm with the goods
@transit_bp.route("/start", methods=["POST"])
def start_transit():
    driver_id = get_current_user(
        request.cookies.get('driver_session_id'), "driver")
    if not driver_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401

    delivery_id = request.json.get("delivery_id")
    if not delivery_id:
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Delivery ID not provided."}), 400

    # 1. Update DB Status (ACCEPTED -> IN_TRANSIT)
    result = update_delivery_status(delivery_id, driver_id, "IN_TRANSIT")

    if result['code'] == 200:
        # 2. Get AI coordinates for the destination market
        # This uses the AI function we just built!
        ai_res = get_destination_location(delivery_id)

        destination_data = {}
        if ai_res["status"] == "SUCCESS":
            destination_data = ai_res["data"]
            # data contains: {"market_name": "...", "lat": 6.5, "lng": 3.4}

        # 3. Push status AND destination coordinates to the Farmer
        emit_status_update(delivery_id, "IN_TRANSIT", destination_data)

    return jsonify(result), result["code"]


# 2. Triggered when the driver reaches the final destination
@transit_bp.route("/complete", methods=["POST"])
def complete_delivery():
    driver_id = get_current_user(
        request.cookies.get('driver_session_id'), "driver")
    if not driver_id:
        return jsonify({"status": "ERROR",
                        "code": 401,
                        "message": "Unauthorized. Please log in."}), 401

    # When using files, other data is in request.form, not request.json
    delivery_id = request.form.get("delivery_id")
    image1 = request.files.get("image1")
    image2 = request.files.get("image2")

    if not all([delivery_id, image1, image2]):
        return jsonify({"status": "ERROR",
                        "code": 400,
                        "message": "Missing ID or images."}), 400

    try:
        res1 = cloudinary.uploader.upload(image1,
                                          folder="farmdrive",
                                          useFilename=True,
                                          unique_filename=True)
        img1_url = res1.get("secure_url", "")

        res2 = cloudinary.uploader.upload(image2,
                                          folder="farmdrive",
                                          useFilename=True,
                                          unique_filename=True)
        img2_url = res2.get("secure_url", "")

        # 1. Update status to DELIVERED/COMPLETED
        result = update_delivery_status(delivery_id, driver_id, "DELIVERED")
        if result["code"] != 200:
            return jsonify(result), result["code"]

        # 2. Save the Cloudinary URLs as proof
        upload_result = completed_delivery(delivery_id, img1_url, img2_url)
        if upload_result["code"] != 201:
            return jsonify(upload_result), upload_result["code"]

        # 3. Create the payment record
        payment_result = request_payment(driver_id, delivery_id)

        if payment_result['code'] != 201:
            return jsonify(payment_result), payment_result["code"]

        # 4. Final Unified Response
        return jsonify({
            "status": "SUCCESS",
            "code": 200,
            "message": "Delivery completed, proof saved, and payment requested.",
            "data": {
                "delivery_id": delivery_id,
                "new_status": "DELIVERED",
                # Assuming request_payment returns data
                "txn_id": payment_result['txn_id'],
                "payment_proof_1": img1_url,
                "payment_proof_2": img2_url,
                "completed_at": time_ago(datetime.now().isoformat())
            }
        }), 200

    except Exception as e:
        return jsonify({"status": "ERROR",
                        "message": f"Error completing delivery: {e}.",
                        "code": 500})
