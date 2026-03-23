from app.database.db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import sqlite3

def hash_password(password):
    return generate_password_hash(password)

def signup_farmer(first_name, last_name, phone, farm_state, farm_city, password):
    db = get_db_connection()
    try:
        cursor = db.cursor()
        password_hash = hash_password(password)
        query = "INSERT INTO farmer (id, first_name, last_name, phone, farm_state, farm_city, password_hash) VALUES (?, ?, ?, ?, ?, ?)" 
        cursor.execute(query, (str(uuid.uuid4()), first_name, last_name, phone, farm_state, farm_city, password_hash))
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