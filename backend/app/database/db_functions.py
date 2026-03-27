from app.database.db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import sqlite3
import secrets
import string
from datetime import datetime, timedelta, timezone


# HELPER FUNCTIONS
def hash_password(password):
    return generate_password_hash(password)


def time_ago(timestamp_str):
    if not timestamp_str:
        return "Unknown"

    # 1. Convert SQLite string to a UTC-aware datetime object
    # SQLite uses 'YYYY-MM-DD HH:MM:SS'
    past = datetime.fromisoformat(timestamp_str).replace(tzinfo=timezone.utc)

    # 2. Get current time in UTC (The non-deprecated way)
    now = datetime.now(timezone.utc)

    # 3. Calculate difference
    diff = now - past

    # Logic remains the same
    seconds = diff.total_seconds()
    if seconds < 60:
        return "Just now"
    if seconds < 3600:
        return f"{int(seconds // 60)}m ago"
    if seconds < 86400:
        return f"{int(seconds // 3600)}h ago"
    if diff.days < 30:
        return f"{diff.days}d ago"

    return past.strftime("%b %d, %Y")  # e.g., Oct 27, 2023


def create_session(session_id, user_id, role):
    db = get_db_connection()
    try:
        if role == "farmer":
            cursor = db.cursor()
            delete_query = "DELETE FROM farmer_sessions WHERE farmer_id = ?"
            cursor.execute(delete_query, (user_id,))
            insert_query = "INSERT INTO farmer_sessions (id, farmer_id, expires_at) VALUES (?, ?, ?)"
            cursor.execute(insert_query, (session_id, user_id,
                           datetime.now() + timedelta(days=1)))
            db.commit()
        elif role == "driver":
            cursor = db.cursor()
            delete_query = "DELETE FROM driver_sessions WHERE driver_id = ?"
            cursor.execute(delete_query, (user_id,))
            insert_query = "INSERT INTO driver_sessions (id, driver_id, expires_at) VALUES (?, ?, ?)"
            cursor.execute(insert_query, (session_id, user_id,
                           datetime.now() + timedelta(days=1)))
            db.commit()
        else:
            pass
    finally:
        if db:
            db.close()


def get_current_user(session_id, role):
    if not session_id:
        return None

    db = get_db_connection()
    try:
        if role == "farmer":
            cursor = db.cursor()
            cursor.execute(
                "SELECT farmer_id FROM farmer_sessions WHERE id = ? AND expires_at > datetime(?)", (session_id, datetime.now()))
            session = cursor.fetchone()
            return session[0] if session else None
        elif role == "driver":
            cursor = db.cursor()
            cursor.execute(
                "SELECT driver_id FROM driver_sessions WHERE id = ? AND expires_at > datetime(?)", (session_id, datetime.now()))
            session = cursor.fetchone()
            return session[0] if session else None
        else:
            pass
    finally:
        if db:
            db.close()


def get_travel_time(distance_km, speed_kmh=60):
    total_hours = distance_km / speed_kmh

    hours = int(total_hours)
    minutes = round((total_hours - hours) * 60)
    return {"hr": hours,
            "min": minutes}


def distance_away(distance):
    if distance < 1:
        return f"{round(distance * 1000)}m away"

    return f"{round(distance)}km away"


def time_away(distance):
    timeT = get_travel_time(distance)
    hr = timeT["hr"]
    min = timeT["min"]
    if hr < 1:
        if min == 0:
            return "Nearby"
        elif min == 1:
            return f"{min}min"
        elif min > 1:
            return f"{min}mins"
    elif hr == 1 and min == 1:
        return f"{hr}hr {min}min"
    elif hr == 1 and min < 0:
        return f"{hr}hr"
    elif hr == 1 and min > 1:
        return f"{hr}hr {min}mins"
    elif hr > 1 and min == 1:
        return f"{hr}hrs {min}min"
    elif hr > 1 and min < 0:
        return f"{hr}hrs"
    elif hr > 1 and min > 1:
        return f"{hr}hrs {min}mins"
    else:
        return f"{hr}hr {min}min"


def generate_delivery_id(length=8):
    # Use uppercase letters and digits to make it readable and professional
    alphabet = string.ascii_uppercase + string.digits
    unique_part = ''.join(secrets.choice(alphabet) for _ in range(length))
    return f"DEL-{unique_part}"


def count_digit(value):
    if (value / 10) < 1:
        return f"0{value}"
    else:
        return value


def generate_transaction_id(length=6):
    # Use uppercase letters and digits to make it readable and professional
    alphabet = string.ascii_uppercase + string.digits
    timeNow = datetime.now()
    day = count_digit(timeNow.day)
    month = count_digit(timeNow.month)
    year = timeNow.year
    hour = timeNow.hour
    min = timeNow.minute
    sec = timeNow.second
    first_unique_part = f"{day}{month}{year}{hour}{min}{sec}"
    second_unique_part = ''.join(secrets.choice(alphabet)
                                 for _ in range(length))

    return f"TXN-{first_unique_part}{second_unique_part}"


# DATABASE FUNCTIONS
# Farmer
def signup_farmer(first_name, last_name, phone, farm_state, farm_city, password):
    db = get_db_connection()
    try:
        cursor = db.cursor()
        password_hash = hash_password(password)
        query = "INSERT INTO farmer (id, first_name, last_name, phone, farm_state, farm_city, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)"
        cursor.execute(query, (str(uuid.uuid4()), first_name,
                       last_name, phone, farm_state, farm_city, password_hash))
        db.commit()
        return {"status": "CREATED",
                "message": "User created successfully.",
                "code": 201}
    except sqlite3.IntegrityError:
        return {"status": "ERROR",
                "message": "Phone number already registered",
                "code": 400}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error occurred while creating user: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Driver
def signup_driver(email, first_name, last_name, phone, password):
    db = get_db_connection()
    try:
        cursor = db.cursor()
        password_hash = hash_password(password)
        query = "INSERT INTO driver (id, email, first_name, last_name, phone, password_hash) VALUES (?, ?, ?, ?, ?, ?)"
        cursor.execute(query, (str(uuid.uuid4()), email,
                       first_name, last_name, phone, password_hash))
        db.commit()
        return {"status": "CREATED",
                "message": "User created successfully.",
                "code": 201}
    except sqlite3.IntegrityError:
        return {"status": "ERROR",
                "message": "Email or phone number already registered",
                "code": 400}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error occurred while creating user: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Farmer
def login_farmer(phone, password):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query = "SELECT id, password_hash, first_name FROM farmer WHERE phone = ?"
        cursor.execute(query, (phone,))
        user = cursor.fetchone()

        if user and check_password_hash(user[1], password):
            return {"status": "OK",
                    "message": "Farmer login successful.",
                    "id": str(user[0]),
                    "name": user[2],
                    "code": 200}
        else:
            return {"status": "ERROR",
                    "message": "Invalid credentials.",
                    "code": 401}
    except Exception as e:
        return {"status": "ERROR",
                "message": f"Error occurred while logging in farmer: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Driver
def login_driver(email, password):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query = "SELECT id, password_hash, first_name FROM driver WHERE email = ?"
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user[1], password):
            return {"status": "OK",
                    "message": "Driver login successful.",
                    "id": str(user[0]),
                    "name": user[2],
                    "code": 200}
        else:
            return {"status": "ERROR",
                    "message": "Invalid credentials.",
                    "code": 401}
    except Exception as e:
        return {"status": "ERROR",
                "message": f"Error occurred while logging in driver: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Everybody
def logout(user_id, role):
    db = get_db_connection()
    try:
        if role == "farmer":
            cursor = db.cursor()
            cursor.execute(
                "DELETE FROM farmer_sessions WHERE farmer_id = ?", (user_id,))
        elif role == "driver":
            cursor = db.cursor()
            cursor.execute(
                "DELETE FROM driver_sessions WHERE driver_id = ?", (user_id,))

            query1 = "SELECT is_available FROM driver WHERE id = ?"
            cursor.execute(query1, (user_id,))
            row = cursor.fetchone()

            # Depicts that driver is not verified
            if row["is_available"] == 0:
                return {"status": "SUCCESS",
                        "message": "Driver already inactive because not verified. Log out successful.",
                        "code": 200}

            query2 = "UPDATE driver SET is_available = 0 WHERE id = ?"
            cursor.execute(query2, (user_id,))
        db.commit()
        return {"status": "OK",
                "message": "User successfully logged out.",
                "code": 200}
    except Exception as e:
        return {"status": "ERROR",
                "message": f"Error occurred while logging out: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Driver
def set_driver_active(email):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query1 = "SELECT id, is_verified FROM driver WHERE email = ?"
        cursor.execute(query1, (email,))
        row = cursor.fetchone()

        if row is None:
            print({"status": "ERROR",
                   "message": "Driver not found.",
                   "code": 404})
            return {"bool": False, "verified": False, "id": None}
        else:
            if row[1] == 0:
                print({"status": "ERROR",
                       "message": "Driver not verified.",
                       "code": 400})
                return {"bool": True, "verified": False, "id": row[0]}
            query2 = "UPDATE driver SET is_available = 1 WHERE email = ?"
            cursor.execute(query2, (email,))

            db.commit()
            print({"status": "SUCCESS",
                   "code": 200,
                   "message": "Driver is now active."})
            return {"bool": True, "verified": True, "id": row[0]}
    except sqlite3.Error as e:
        print({"status": "ERROR",
               "message": f"Error setting driver active: {e}.",
               "code": 500})
        return {"bool": False, "verified": False, "id": None}
    finally:
        if db:
            db.close()


# Driver
def driver_kyc(driver_id, vehicle_type, license_plate, bank_name, account_number, account_name, profile_picture_url=None):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query1 = "SELECT is_verified FROM driver WHERE id = ?"
        cursor.execute(query1, (driver_id,))
        row = cursor.fetchone()

        if row is None:
            return {"status": "ERROR",
                    "message": "Driver not found.",
                    "code": 404}
        if row['is_verified'] == 1:
            return {"status": "ERROR",
                    "message": "Driver already verified.",
                    "code": 400}

        query2 = "UPDATE driver SET vehicle_type = ?, license_plate = ?, bank_name = ?, account_number = ?, account_name = ?, profile_picture_url = ?, is_verified = 1, is_available = 1 WHERE id = ?"
        cursor.execute(query2, (vehicle_type, license_plate, bank_name,
                       account_number, account_name, profile_picture_url, driver_id))

        # This allows the driver to become visible
        query3 = "INSERT OR IGNORE INTO driver_pos (driver_id, lat, lng, last_updated) VALUES (?, 0, 0, CURRENT_TIMESTAMP)"
        cursor.execute(query3, (driver_id,))

        db.commit()
        return {"status": "SUCCESS",
                "code": 200,
                "message": "Driver KYC submitted successfully."}
    except sqlite3.IntegrityError:
        return {"status": "ERROR",
                "message": "License plate already registered.",
                "code": 400}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error updating driver details: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Farmer
def get_farmer_position(farmer_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query1 = "SELECT lat, lng FROM farmer_pos WHERE farmer_id = ?"
        cursor.execute(query1, (farmer_id,))
        row1 = cursor.fetchone()

        if row1 is None:
            return {"status": "ERROR",
                    "message": "Farmer not found. Cannot get position for a non-existent farmer",
                    "code": 404}

        db.commit()
        return {"status": "SUCCESS",
                "lat": row1["lat"],
                "lng": row1["lng"],
                "code": 200,
                "message": "Farmer position fetched successfully."}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error getting farmer position: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Farmer
def update_farmer_position(farmer_id, lat, lng):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query1 = "SELECT 1 FROM farmer_pos WHERE farmer_id = ?"
        cursor.execute(query1, (farmer_id,))
        exists = cursor.fetchone()

        if exists is None:
            # First time posting? Create the record.
            query = "INSERT INTO farmer_pos (farmer_id, lat, lng) VALUES (?, ?, ?)"
            cursor.execute(query, (farmer_id, lat, lng))
        else:
            # Already exists? Just update it.
            query = "UPDATE farmer_pos SET lat = ?, lng = ?, last_updated = CURRENT_TIMESTAMP WHERE farmer_id = ?"
            cursor.execute(query, (lat, lng, farmer_id))

        db.commit()
        return {"status": "SUCCESS",
                "code": 200,
                "message": "Farmer location updated successfully."}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error updating farmer position: {e}",
                "code": 500}
    finally:
        if db:
            db.close()


# Driver
def get_driver_position(driver_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query = "SELECT d.is_available, p.lat, p.lng FROM driver AS d LEFT JOIN driver_pos AS p ON d.id = p.driver_id WHERE d.id = ?"
        cursor.execute(query, (driver_id,))
        row = cursor.fetchone()

        if row["is_available"] == 0:
            return {"status": "ERROR",
                    "message": "Driver not currently active.",
                    "code": 200}

        if not all([row["lat"], row["lng"]]):
            return {"status": "ERROR",
                    "message": "Driver not found.",
                    "code": 404}

        db.commit()
        return {"status": "SUCCESS",
                "lat": row["lat"],
                "lng": row["lng"],
                "code": 200,
                "message": "Driver location retrieved successfully."}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error getting driver position: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Driver
def update_driver_position(driver_id, lat, lng):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query1 = "SELECT id FROM driver_pos WHERE driver_id = ?"
        cursor.execute(query1, (driver_id,))
        row = cursor.fetchone()

        if row is None:
            return {"status": "ERROR",
                    "message": "Driver hasn't completed his KYC so he can't bid.",
                    "code": 404}
        else:
            query = "UPDATE driver_pos SET lat = ?, lng = ?, last_updated = CURRENT_TIMESTAMP WHERE driver_id = ?"
            cursor.execute(query, (lat, lng, driver_id))

        db.commit()
        return {"status": "SUCCESS",
                "code": 200,
                "message": "Driver position updated successfully."}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error updating driver position: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Farmer
def save_produce_details(farmer_id, crop_name, pickup_location, destination, quantity, details) -> dict:
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query1 = "SELECT id FROM farmer WHERE id = ?"
        cursor.execute(query1, (farmer_id,))
        row = cursor.fetchone()

        if row is None:
            return {"status": "ERROR",
                    "code": 404,
                    "message": "Farmer not found. Cannot add produce details for a non-existent farmer."}

        produce_id = str(uuid.uuid4())
        query2 = "INSERT INTO farm_produce (id, farmer_id, crop_name, pickup_location, destination, quantity, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)"
        cursor.execute(query2, (produce_id, farmer_id, crop_name,
                       pickup_location, destination, quantity, details))
        id = cursor.lastrowid
        db.commit()
        return {"status": "SUCCESS",
                "produce_id": produce_id,
                "code": 201,
                "message": "Produce details added successfully."}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error adding produce details: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Driver
def get_all_produce(driver_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        # 1. Join with farmer for names
        # 2. LEFT JOIN with produce_price for THIS driver
        # 3. Filter for rows where the LEFT JOIN found nothing (price IS NULL)
        query = """
            SELECT p.*, f.first_name, f.last_name 
            FROM farm_produce p
            JOIN farmer f ON p.farmer_id = f.id
            LEFT JOIN produce_price pp ON p.id = pp.produce_id AND pp.driver_id = ?
            WHERE pp.id IS NULL   -- Filter 1: Current driver hasn't bid yet
            AND NOT EXISTS (      -- Filter 2: No other driver's bid has been accepted
                SELECT 1 FROM produce_price 
                WHERE produce_id = p.id AND accepted = 1
            )
            ORDER BY p.created_at DESC
        """

        cursor.execute(query, (driver_id,))
        rows = cursor.fetchall()

        if not rows:
            return {"status": "SUCCESS",
                    "message": "No new produce available.",
                    "code": 200,
                    "produce": []}

        produce_list = []
        for row in rows:
            produce_list.append({
                "id": row["id"],
                "farmer_name": f"{row['first_name']} {row['last_name']}",
                "crop_name": row["crop_name"],
                "pickup_location": row["pickup_location"],
                "destination": row["destination"],
                "quantity": row["quantity"],
                "details": row["details"],
                "posted_at": time_ago(row["created_at"])
            })

        return {"status": "SUCCESS",
                "produce": produce_list,
                "code": 200,
                "message": "Successfully retrieved all available farm produce."}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error retrieving produce details: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Farmer
def get_produce_for_farmer(farmer_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        initQuery = "SELECT id FROM farm_produce WHERE farmer_id = ?"
        cursor.execute(initQuery, (farmer_id,))
        initRow = cursor.fetchone()

        if initRow is None:
            return {"status": "SUCCESS",
                    "message": "No farm produce has been posted by this farmer",
                    "code": 200}

        query = "SELECT * FROM farm_produce WHERE farmer_id = ?"
        cursor.execute(query, (farmer_id,))
        rows = cursor.fetchall()

        produce_list = []
        for row in rows:
            produce_list.append({
                "id": row["id"],
                "crop_name": row["crop_name"],
                "pickup_location": row["pickup_location"],
                "destination": row["destination"],
                "quantity": row["quantity"],
                "details": row["details"],
                "status": row["status"],
                "posted_at": time_ago(row["created_at"])
            })
        if produce_list == []:
            return {"status": "SUCCESS",
                    "message": "No farm produce has been posted yet.",
                    "code": 200}

        return {"status": "success",
                "produce": produce_list,
                "code": 200,
                "message": "All produce per farmer retrieved successfully."}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error retrieving produce details per farmer: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()


# Driver
def set_price_by_driver(driver_id, produce_id, price, driver_distance):
    db = get_db_connection()
    try:
        cursor = db.cursor()
        print(driver_id)

        # 1. Unified check: Does driver exist? Does produce exist? Is it already accepted?
        # We use a LEFT JOIN to check everything in one trip to the DB.
        check_query = """
            SELECT 
                (SELECT 1 FROM driver WHERE id = ?) AS driver_exists,
                (SELECT 1 FROM farm_produce WHERE id = ?) AS produce_exists,
                (SELECT 1 FROM produce_price WHERE produce_id = ? AND accepted = 1 LIMIT 1) AS already_accepted
        """
        cursor.execute(check_query, (driver_id, produce_id, produce_id))
        status = cursor.fetchone()

        # 2. Handle validation errors based on the check results
        if not status['driver_exists']:
            return {"status": "ERROR",
                    "code": 404,
                    "message": "Driver not found."}

        if not status['produce_exists']:
            return {"status": "ERROR",
                    "code": 404,
                    "message": "Farm produce not found."}

        if status['already_accepted']:
            return {"status": "ERROR",
                    "code": 400,
                    "message": "A price has already been accepted for this produce."}

        query = "INSERT INTO produce_price (produce_id, driver_id, price, driver_distance) VALUES (?, ?, ?, ?)"
        cursor.execute(query, (produce_id, driver_id, price, driver_distance))

        # Update produce status to MATCHED
        cursor.execute(
            "UPDATE farm_produce SET status = 'MATCHED' WHERE id = ? AND status = 'PENDING'",
            (produce_id,)
        )

        db.commit()
        return {"status": "SUCCESS",
                "code": 201,
                "message": "Price bid submitted successfully."}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "code": 500,
                "message": f"Database error: {e}."}
    finally:
        if db:
            db.close()


# Farmer
def get_produce_details(produce_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query = "SELECT farmer_id FROM farm_produce WHERE id = ?"
        cursor.execute(query, (produce_id, ))
        row = cursor.fetchone()

        if row is None:
            return {
                "status": "ERROR",
                "message":
                "Farm produce not found. Cannot fetch details for a non-existent farm produce.",
                "code": 404
            }

        return {
            "status": "SUCCESS",
            "farmer_id": row[0],
            "code": 200,
            "message": "Farmer id fetched successfully from produce id."
        }
    except sqlite3.Error as e:
        return {
            "status": "ERROR",
            "message": f"Error fetching produce details: {e}.",
            "code": 500
        }
    finally:
        if db:
            db.close()


# Farmer
def get_produce_details_for_matching(produce_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query = "SELECT * FROM farm_produce WHERE id = ?"
        cursor.execute(query, (produce_id,))
        row = cursor.fetchone()

        if row is None:
            return {
                "status": "ERROR",
                "message": "Farm produce not found.",
                "code": 404
            }

        # Return the full object so the AI knows the context of the job
        return {
            "status": "SUCCESS",
            "code": 200,
            "data": {
                "id": row["id"],
                "crop_name": row["crop_name"],
                "pickup_location": row["pickup_location"],
                "destination": row["destination"],
                "quantity": row["quantity"],
                "details": row["details"],
                "status": row["status"]
            }
        }
    except sqlite3.Error as e:
        return {
            "status": "ERROR",
            "message": f"Error fetching produce details: {e}.",
            "code": 500
        }
    finally:
        if db:
            db.close()


# Farmer
def fetch_prices_for_produce(produce_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        # 1. Check if produce exists and get prices/driver info in ONE query
        # We use a JOIN to merge produce_price and driver tables
        query = """
            SELECT 
                pp.driver_id, pp.price, pp.driver_distance,
                d.first_name, d.last_name, d.phone, d.profile_picture_url, d.vehicle_type, d.rating,
                (SELECT 1 FROM farm_produce WHERE id = ?) AS produce_exists
            FROM produce_price pp
            JOIN driver d ON pp.driver_id = d.id
            WHERE pp.produce_id = ? AND pp.accepted = 0
        """
        cursor.execute(query, (produce_id, produce_id))
        rows = cursor.fetchall()

        # 2. Handle 'Not Found' case
        # If no rows return, we still need to know if the produce itself exists
        if not rows:
            cursor.execute("SELECT 1 FROM farm_produce WHERE id = ?",
                           (produce_id, ))
            if not cursor.fetchone():
                return {
                    "status": "ERROR",
                    "code": 404,
                    "message": "Farm produce not found."
                }

            return {
                "status": "SUCCESS",
                "code": 200,
                "prices": [],
                "message": "No bids yet."
            }

        # 3. Build the list efficiently
        prices_list = [{
            "driver_id": row["driver_id"],
            "profile_picture": str(row["profile_picture_url"]),
            "price": row["price"],
            "driver_name": f"{row['first_name']} {row['last_name']}",
            "driver_phone": row["phone"],
            "vehicle_type": row["vehicle_type"],
            "rating": row["rating"],
            "driver_distance": distance_away(row["driver_distance"]),
            "time_away": time_away(row["driver_distance"])
        } for row in rows]

        return {
            "status": "SUCCESS",
            "prices": prices_list,
            "code": 200,
            "message": "Prices fetched successfully."
        }

    except sqlite3.Error as e:
        return {
            "status": "ERROR",
            "code": 500,
            "message": f"Error fetching prices: {e}."
        }
    finally:
        if db:
            db.close()


# Farmer
def accept_price_for_produce(produce_id, driver_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        # 1. Unified Validation: Check if bid exists AND if ANY bid was already accepted
        # Using a subquery for 'already_accepted' is much faster than fetchall()
        check_query = """
            SELECT 
                pp.farmer_id, pp.price,
                (SELECT 1 FROM produce_price WHERE produce_id = ? AND accepted = 1 LIMIT 1) AS already_accepted
            FROM (
                SELECT fp.farmer_id, p.price 
                FROM produce_price p 
                JOIN farm_produce fp ON p.produce_id = fp.id 
                WHERE p.produce_id = ? AND p.driver_id = ?
            ) AS pp
        """
        cursor.execute(check_query, (produce_id, produce_id, driver_id))
        row = cursor.fetchone()

        # 2. Handle Logic Errors
        if not row:
            return {
                "status": "ERROR",
                "code": 404,
                "message": "Price bid not found."
            }

        if row["already_accepted"]:
            return {
                "status": "ERROR",
                "code": 400,
                "message": "A price has already been accepted for this produce."
            }

        # 3. Atomic Updates (Transaction)
        # Update the specific bid to accepted
        cursor.execute(
            """
            UPDATE produce_price 
            SET accepted = 1, accepted_at = CURRENT_TIMESTAMP 
            WHERE produce_id = ? AND driver_id = ?
        """, (produce_id, driver_id))

        # Create the delivery record
        delivery_id = generate_delivery_id()
        cursor.execute(
            """
            INSERT INTO deliveries (id, produce_id, driver_id, farmer_id, price) 
            VALUES (?, ?, ?, ?, ?)
        """, (delivery_id, produce_id, driver_id, row["farmer_id"], row["price"]))

        # Update produce status to ACCEPTED
        cursor.execute(
            "UPDATE farm_produce SET status = 'ACCEPTED' WHERE id = ?",
            (produce_id,)
        )

        db.commit()

        return {
            "status": "SUCCESS",
            "code": 200,
            "delivery_id": delivery_id,
            "message": "Price accepted and delivery initiated!"
        }

    except sqlite3.Error as e:
        db.rollback()  # Undo changes if anything fails
        return {
            "status": "ERROR",
            "code": 500,
            "message": f"Error accepting price: {e}."
        }
    finally:
        db.close()


# Farmer
def fetch_accepted_delivery_for_farmer(farmer_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()
        # Query joins Delivery -> Produce -> Driver -> Driver Position
        query = """
            SELECT
                d.id AS delivery_id, d.price, d.status, d.accepted_at,
                p.crop_name, p.pickup_location, p.destination, p.quantity, p.details,
                dr.first_name AS driver_fname, dr.last_name AS driver_lname,
                dr.phone AS driver_phone, dr.vehicle_type, dr.license_plate, dr.profile_picture_url,
                dp.lat AS driver_lat, dp.lng AS driver_lng
            FROM deliveries d
            JOIN farm_produce p ON d.produce_id = p.id
            JOIN driver dr ON d.driver_id = dr.id
            LEFT JOIN driver_pos dp ON dp.driver_id = dr.id
            WHERE d.farmer_id = ? AND d.status != 'DELIVERED'
            ORDER BY d.accepted_at DESC
        """
        cursor.execute(query, (farmer_id, ))
        rows = cursor.fetchall()

        if not rows:
            return {
                "status": "SUCCESS",
                "message": "No active deliveries found.",
                "code": 200,
                "active_deliveries": []
            }

        active_deliveries = [{
            "delivery_id": row["delivery_id"],
            "driver_name": f"{row['driver_fname']} {row['driver_lname']}",
            "driver_phone": row["driver_phone"],
            "driver_vehicle": row["vehicle_type"],
            "driver_plate": row["license_plate"],
            "driver_image": row["profile_picture_url"],
            "driver_lat": row["driver_lat"],
            "driver_lng": row["driver_lng"],
            "crop_name": row["crop_name"],
            "pickup_location": row["pickup_location"],
            "destination": row["destination"],
            "quantity": row["quantity"],
            "price": row["price"],
            "status": row["status"],
            "accepted_at": time_ago(row["accepted_at"]) # Assuming you have your time_ago helper
        } for row in rows]

        return {
            "status": "SUCCESS",
            "active_deliveries": active_deliveries,
            "code": 200,
            "message": "Fetched driver info for farmer successfully."
        }
    except sqlite3.Error as e:
        return {
            "status": "ERROR",
            "code": 500,
            "message": f"Error fetching driver info: {e}."
        }
    finally:
        db.close()
    db = get_db_connection()
    try:
        cursor = db.cursor()
        # Single query to join Delivery -> Produce -> Farmer
        query = """
            SELECT 
                d.id, d.price, d.status, d.accepted_at,
                p.crop_name, p.pickup_location, p.destination, p.quantity, p.details,
                f.first_name, f.last_name, f.phone
            FROM deliveries d
            JOIN farm_produce p ON d.produce_id = p.id
            JOIN farmer f ON p.farmer_id = f.id
            WHERE d.driver_id = ?
            ORDER BY d.accepted_at DESC
        """
        cursor.execute(query, (driver_id, ))
        rows = cursor.fetchall()

        if not rows:
            return {
                "status": "SUCCESS",
                "message": "No accepted deliveries found.",
                "code": 200,
                "accepted_produce": []
            }

        accepted_produce_list = [{
            "delivery_id": row["id"],
            "farmer_name": f"{row['first_name']} {row['last_name']}",
            "farmer_phone": f"{row['phone']}",
            "crop_name": row["crop_name"],
            "pickup_location": row["pickup_location"],
            "destination": row["destination"],
            "quantity": row["quantity"],
            "details": row["details"],
            "price": row["price"],
            "status": row["status"],
            "accepted_at": time_ago(row["accepted_at"])
        } for row in rows]

        return {
            "status": "SUCCESS",
            "accepted_produce": accepted_produce_list,
            "code": 200,
            "message": "Fetched deliveries for driver successfully."
        }
    except sqlite3.Error as e:
        return {
            "status": "ERROR",
            "code": 500,
            "message": f"Error fetching accepted delivery for driver: {e}."
        }
    finally:
        db.close()


# Driver
def fetch_accepted_delivery_for_driver(driver_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()
        # Single query to join Delivery -> Produce -> Farmer
        query = """
            SELECT 
                d.id, d.price, d.status, d.accepted_at,
                p.crop_name, p.pickup_location, p.destination, p.quantity, p.details,
                f.first_name, f.last_name, f.phone,
                fp.lat, fp.lng
            FROM deliveries d
            JOIN farm_produce p ON d.produce_id = p.id
            JOIN farmer f ON p.farmer_id = f.id
            JOIN farmer_pos fp ON fp.farmer_id = f.id
            WHERE d.driver_id = ?
            ORDER BY d.accepted_at DESC
        """
        cursor.execute(query, (driver_id, ))
        rows = cursor.fetchall()

        if not rows:
            return {
                "status": "SUCCESS",
                "message": "No accepted deliveries found.",
                "code": 200,
                "accepted_produce": []
            }

        accepted_produce_list = [{
            "delivery_id": row["id"],
            "farmer_name": f"{row['first_name']} {row['last_name']}",
            "farmer_phone": f"{row['phone']}",
            "farmer_lat": f"{row['lat']}",
            "farmer_lng": f"{row['lng']}",
            "crop_name": row["crop_name"],
            "pickup_location": row["pickup_location"],
            "destination": row["destination"],
            "quantity": row["quantity"],
            "details": row["details"],
            "price": row["price"],
            "status": row["status"],
            "accepted_at": time_ago(row["accepted_at"])
        } for row in rows]

        return {
            "status": "SUCCESS",
            "accepted_produce": accepted_produce_list,
            "code": 200,
            "message": "Fetched deliveries for driver successfully."
        }
    except sqlite3.Error as e:
        return {
            "status": "ERROR",
            "code": 500,
            "message": f"Error fetching accepted delivery for driver: {e}."
        }
    finally:
        db.close()


# Driver
def fetch_all_bids(driver_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()
        # This query checks:
        # 1. Did THIS driver get accepted?
        # 2. Did ANYONE ELSE get accepted for this produce?
        query = """
            SELECT 
                pp.id AS bid_id, pp.price, pp.accepted AS is_this_bid_accepted, pp.created_at,
                p.id AS produce_id, p.crop_name, p.pickup_location, p.destination,
                f.first_name, f.last_name,
                (SELECT 1 FROM produce_price WHERE produce_id = p.id AND accepted = 1 LIMIT 1) AS is_produce_closed
            FROM produce_price pp
            JOIN farm_produce p ON pp.produce_id = p.id
            JOIN farmer f ON p.farmer_id = f.id
            WHERE pp.driver_id = ?
            ORDER BY pp.created_at DESC
        """
        cursor.execute(query, (driver_id, ))
        rows = cursor.fetchall()

        if not rows:
            return {
                "status": "SUCCESS",
                "code": 200,
                "bids": [],
                "message": "You haven't placed any bids yet."
            }

        bids_list = []
        for row in rows:
            # logic to determine the 3 possible states:
            if row["is_this_bid_accepted"] == 1:
                status_text = "Accepted"
                status_color = "green"
            elif row["is_produce_closed"] == 1:
                # Someone else got it!
                status_text = "Closed (Sold to another)"
                status_color = "red"
            else:
                status_text = "Awaiting Acceptance"
                status_color = "yellow"

            bids_list.append({
                "bid_id": row["bid_id"],
                "farmer_name": f"{row['first_name']} {row['last_name']}",
                "crop_name": row["crop_name"],
                "pickup_location": row["pickup_location"],
                "destination": row["destination"],
                "price": row["price"],
                "status": status_text,
                "color": status_color,  # Frontend can use this for CSS
                "posted_at": time_ago(row["created_at"])
            })

        return {
            "status": "SUCCESS",
            "code": 200,
            "bids": bids_list,
            "message": "Bids history retrieved successfully."
        }
    except sqlite3.Error as e:
        return {
            "status": "ERROR",
            "code": 500,
            "message": f"Error fetching bids: {e}."
        }
    finally:
        if db:
            db.close()


# Driver
def update_delivery_status(delivery_id, driver_id, new_status):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        # Fetch both driver_id and produce_id
        cursor.execute(
            "SELECT driver_id, produce_id FROM deliveries WHERE id = ?", (delivery_id,))
        row = cursor.fetchone()

        if not row:
            return {"status": "ERROR",
                    "code": 404,
                    "message": "Delivery not found."}
        if row['driver_id'] != driver_id:
            return {"status": "ERROR", "code": 403, "message": "Unauthorized."}

        produce_id = row['produce_id']

        # Mapping statuses between the two tables
        # If delivery is DELIVERED, produce is COMPLETED
        produce_status = "COMPLETED" if new_status == "DELIVERED" else new_status

        # Update Deliveries Table
        if new_status == "DELIVERED":
            cursor.execute(
                "UPDATE deliveries SET status = ?, delivered_at = CURRENT_TIMESTAMP WHERE id = ?", (new_status, delivery_id))
        else:
            cursor.execute(
                "UPDATE deliveries SET status = ? WHERE id = ?", (new_status, delivery_id))

        # Update Farm Produce Table
        cursor.execute(
            "UPDATE farm_produce SET status = ? WHERE id = ?", (produce_status, produce_id))

        db.commit()

        return {"status": "SUCCESS",
                "code": 200,
                "message": f"Status updated to {new_status}"}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error updating delivery status: {e}.",
                "code": 500}
    finally:
        db.close()


# Driver
def request_payment(driver_id, delivery_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        query1 = "SELECT produce_id, farmer_id, price FROM deliveries WHERE id = ? AND driver_id = ?"
        cursor.execute(query1, (delivery_id, driver_id,))
        row = cursor.fetchone()

        if not row:
            return {"status": "ERROR",
                    "code": 404,
                    "message": "Delivery not found."}

        payment_id = generate_transaction_id()
        query2 = "INSERT INTO payments (id, farmer_id, driver_id, produce_id, amount) VALUES (?, ?, ?, ?, ?)"
        cursor.execute(
            query2, (payment_id, row['farmer_id'], driver_id, row['produce_id'], row['price']))

        db.commit()
        return {"status": "SUCCESS",
                "code": 201,
                "txn_id": payment_id,
                "message": "Successfully requested payment."}
    except sqlite3.Error as e:
        db.rollback()
        return {"status": "ERROR",
                "code": 500,
                "message": f"Error inserting payment details: {e}."}
    finally:
        if db:
            db.close()


# Driver
def view_payments(farmer_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        # Added JOIN with farm_produce to get the crop_name
        query = """
            SELECT 
                p.id AS txn_id, p.amount, p.status, p.started_at,
                d.first_name, d.last_name, d.phone, 
                d.bank_name, d.account_number, d.account_name,
                fp.crop_name
            FROM payments p 
            JOIN driver d ON p.driver_id = d.id 
            JOIN farm_produce fp ON p.produce_id = fp.id
            WHERE p.farmer_id = ?
            ORDER BY p.started_at DESC
        """
        cursor.execute(query, (farmer_id,))
        rows = cursor.fetchall()

        if not rows:
            return {
                "status": "SUCCESS",
                "code": 200,
                "payments": [],
                "message": "No available payments found."
            }

        payments = []
        for row in rows:
            # Convert the stored Naira amount to Kobo (Integer)
            # We use int() to ensure it's a clean whole number for the frontend
            amount_in_kobo = int(row["amount"] * 100)

            payments.append({
                "txn_id": row["txn_id"],
                "amount_kobo": amount_in_kobo,
                "amount": row["amount"],  # Keeping both just in case
                "crop": row["crop_name"],
                "driver_name": f"{row['first_name']} {row['last_name']}",
                "phone": row["phone"],
                "bank": row["bank_name"] or "N/A",
                "acc_number": row["account_number"] or "N/A",
                "acc_name": row["account_name"] or "N/A",
                "status": row["status"],
                "date": time_ago(row["started_at"])
            })

        return {
            "status": "SUCCESS",
            "code": 200,
            "payments": payments,
            "message": "All payments retrieved successfully."
        }
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "code": 500,
                "message": f"Error retrieving payments: {e}."}

    finally:
        if db:
            db.close()


# Driver
def driver_stats(driver_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        # 1. Earnings and Completed Jobs (from payments table)
        # We count rows where status is 'SUCCESSFUL' as completed_jobs
        query_payments = """
            SELECT 
                SUM(CASE WHEN status = 'SUCCESSFUL' THEN amount ELSE 0 END) as earned,
                SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END) as pending,
                COUNT(CASE WHEN status = 'SUCCESSFUL' THEN 1 END) as completed_jobs
            FROM payments 
            WHERE driver_id = ?
        """
        cursor.execute(query_payments, (driver_id,))
        p_data = cursor.fetchone()

        # 2. Total Deliveries (from deliveries table)
        cursor.execute(
            "SELECT COUNT(*) as total FROM deliveries WHERE driver_id = ?", (driver_id,))
        d_data = cursor.fetchone()

        # 3. Available Jobs in Marketplace (from farm_produce table)
        # Jobs are available if NO price bid for that produce has been accepted yet
        query_market = """
            SELECT COUNT(*) as available 
            FROM farm_produce p
            WHERE NOT EXISTS (
                SELECT 1 FROM produce_price WHERE produce_id = p.id AND accepted = 1
            )
        """
        cursor.execute(query_market)
        m_data = cursor.fetchone()

        # Safely extract numbers (handle None for new users)
        earned = p_data['earned'] or 0
        pending = p_data['pending'] or 0
        completed = p_data['completed_jobs'] or 0
        total_deliveries = d_data['total'] or 0
        available_jobs = m_data['available'] or 0

        return {
            "status": "SUCCESS",
            "code": 200,
            "data": {
                "total_earned_naira": earned,
                # "total_earned_kobo": earned * 100,
                "awaiting_payment_naira": pending,
                # "awaiting_payment_kobo": pending * 100,
                "completed_jobs": completed,
                "total_deliveries": total_deliveries,
                "available_jobs": available_jobs
            },
            "message": "Dashboard stats retrieved successfully."
        }
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "code": 500,
                "message": f"Error fetching dashboard stats: {e}."}
    finally:
        if db:
            db.close()


# Farmer
def farmer_stats(farmer_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        # 1. Total Produce Posted (Count from farm_produce)
        cursor.execute(
            "SELECT COUNT(*) as total FROM farm_produce WHERE farmer_id = ?", (farmer_id,))
        total_p = cursor.fetchone()
        total_produce = total_p['total'] if total_p else 0

        # 2. Delivery Stats (from deliveries table)
        # Active: ACCEPTED, MATCHED, or IN_TRANSIT
        # Completed: DELIVERED
        query_deliveries = """
            SELECT 
                COUNT(CASE WHEN status IN ('ACCEPTED', 'MATCHED', 'IN_TRANSIT') THEN 1 END) as active,
                COUNT(CASE WHEN status = 'DELIVERED' THEN 1 END) as completed
            FROM deliveries 
            WHERE farmer_id = ?
        """
        cursor.execute(query_deliveries, (farmer_id,))
        d_data = cursor.fetchone()

        active_count = d_data['active'] if d_data else 0
        completed_count = d_data['completed'] if d_data else 0

        # 3. Total Payments Made (Successful only)
        # Note: 'amount' is an INTEGER in your schema
        query_payments = """
            SELECT SUM(amount) as total_paid 
            FROM payments 
            WHERE farmer_id = ? AND status = 'SUCCESSFUL'
        """
        cursor.execute(query_payments, (farmer_id,))
        p_data = cursor.fetchone()
        total_paid = p_data['total_paid'] if p_data and p_data['total_paid'] else 0

        return {
            "status": "SUCCESS",
            "code": 200,
            "data": {
                "total_produce": total_produce,
                "active_deliveries": active_count,
                "completed_deliveries": completed_count,
                "total_payment_made": total_paid,
                "total_payment_kobo": total_paid * 100
            },
            "message": "Farmer dashboard statistics retrieved."
        }
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "code": 500,
                "message": f"Error fetching farmer dashboard stats: {e}."}
    finally:
        if db:
            db.close()


# Driver
def completed_delivery(delivery_id, image1, image2):
    db = get_db_connection()
    try:
        cursor = db.cursor()
        # Using INSERT OR REPLACE in case of a retry
        query = """
            INSERT OR REPLACE INTO completed_deliveries (delivery_id, image1_url, image2_url)
            VALUES (?, ?, ?)
        """
        cursor.execute(query, (delivery_id, image1, image2))
        db.commit()
        return {"status": "SUCCESS",
                "code": 201,
                "message": "Proof of delivery saved."}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "code": 500,
                "message": f"Error saving completed deliveries: {e}."}
    finally:
        if db:
            db.close()


# Farmer
def view_completed_deliveries(delivery_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()

        # JOIN with deliveries to make sure we have the right context
        query = """
            SELECT cd.*, d.status, d.price 
            FROM completed_deliveries cd
            JOIN deliveries d ON cd.delivery_id = d.id
            WHERE cd.delivery_id = ?
        """
        cursor.execute(query, (delivery_id,))
        row = cursor.fetchone()

        if not row:
            return {"status": "ERROR",
                    "code": 404, "message":
                    "No proof found for this delivery."}

        return {
            "status": "SUCCESS",
            "code": 200,
            "data": {
                "delivery_id": row["delivery_id"],
                "image_one": row["image1_url"],  # Separate object keys
                "image_two": row["image2_url"],
                "status": row["status"],
                "date": time_ago(row["created_at"])
            }
        }
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "code": 500,
                "message": f"Error fetching completed deliveries: {e}."}
    finally:
        if db:
            db.close()


# Driver
def get_delivery_context(delivery_id):
    db = get_db_connection()
    try:
        cursor = db.cursor()
        # Join deliveries with farm_produce to get the destination and crop
        query = """
            SELECT p.destination, p.crop_name 
            FROM deliveries d
            JOIN farm_produce p ON d.produce_id = p.id
            WHERE d.id = ?
        """
        cursor.execute(query, (delivery_id,))
        return cursor.fetchone()
    finally:
        db.close()
