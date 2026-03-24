from app.database.db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import sqlite3
from datetime import datetime, timedelta


# Everybody
def hash_password(password):
    return generate_password_hash(password)


# Everybody
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


# Everybody
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
            if session and len(session) > 0:
                return session[0]
            return None
        elif role == "driver":
            cursor = db.cursor()
            cursor.execute(
                "SELECT driver_id FROM driver_sessions WHERE id = ? AND expires_at > datetime(?)", (session_id, datetime.now()))
            session = cursor.fetchone()
            if session and len(session) > 0:
                return session[0]
            return None
        else:
            pass
    finally:
        if db:
            db.close()


# Farmer
def signup_farmer(first_name, last_name, phone, farm_state, farm_city, password):
    db = get_db_connection()
    try:
        cursor = db.cursor()
        password_hash = hash_password(password)
        query = "INSERT INTO farmer (id, first_name, last_name, phone, farm_state, farm_city, password_hash) VALUES (?, ?, ?, ?, ?, ?)"
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

        query = "SELECT id, password_hash FROM farmer WHERE phone = ?"
        cursor.execute(query, (phone,))
        user = cursor.fetchone()

        if user and check_password_hash(user[1], password):
            return {"status": "OK",
                    "message": "Farmer login successful.",
                    "id": str(user[0]),
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

        query = "SELECT id, password_hash FROM driver WHERE email = ?"
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user[1], password):
            return {"status": "OK",
                    "message": "Driver login successful.",
                    "id": str(user[0]),
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
        query3 = "INSERT INTO driver_pos (driver_id, lat, lng, last_updated) VALUES (?, 0, 0, CURRENT_TIMESTAMP)"
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

        query2 = "INSERT INTO farm_produce (id, farmer_id, crop_name, pickup_location, destination, quantity, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)"
        cursor.execute(query2, (str(uuid.uuid4()), farmer_id, crop_name,
                       pickup_location, destination, quantity, details))
        id = cursor.lastrowid()
        db.commit()
        return {"status": "SUCCESS",
                "produce_id": id,
                "code": 201,
                "message": "Produce details added successfully."}
    except sqlite3.Error as e:
        return {"status": "ERROR",
                "message": f"Error adding produce details: {e}.",
                "code": 500}
    finally:
        if db:
            db.close()
