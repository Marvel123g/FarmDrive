# Fetch the farm produce details to get the farm location
from app.database.db_functions import get_produce_details, get_farmer_position
from app.math.haversine import calculate_distance


def calculate_initial_driver_distance_from_farmer(driver_lat, driver_lng, produce_id):
    # Getting farmer that posted that produce
    produce_details = get_produce_details(produce_id)
    if "status" == "ERROR" in produce_details:
        print(produce_details)
        return produce_details  # Return the error if produce details couldn't be fetched
    
    farmer_id = produce_details.get("farmer_id")

    # Try to get the farmer's current location
    farmer_position = get_farmer_position(farmer_id)
    if "status" == "ERROR" in farmer_position:
        return farmer_position

    farm_lat = farmer_position.get("lat", "")
    farm_lng = farmer_position.get("lng", "")

    if not all([farm_lat, farm_lng]):
        return {"status": "ERROR",
                "message": "Invalid farmer position.", 
                "code": 400}

    return {"status": "SUCCESS", 
            "distance": calculate_distance(driver_lat, driver_lng, farm_lat, farm_lng), 
            "code": 200,
            "message": "Distance calculated successfully."}
