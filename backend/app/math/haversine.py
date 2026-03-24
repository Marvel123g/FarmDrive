import math

EARTH_RADIUS_KM = 6371.0


def calculate_distance(lat1, lng1, lat2, lng2):
    # Convert degrees to radians
    theta1 = math.radians(lat1)
    theta2 = math.radians(lat2)
    lambda1 = math.radians(lng1)
    lambda2 = math.radians(lng2)

    # Differences
    delta_theta = theta2 - theta1
    delta_lambda = lambda2 - lambda1

    # The Harversine "a" term (the square of half the chord length)
    a = math.sin(delta_theta / 2) ** 2 + math.cos(theta1) * \
        math.cos(theta2) * math.sin(delta_lambda / 2) ** 2

    # The c term (the angular distance in radians)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return EARTH_RADIUS_KM * c
