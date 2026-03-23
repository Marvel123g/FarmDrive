from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from app.database.db import init_db

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    from app.routes.farmer.auth import farmer_auth_bp
    from app.routes.driver.auth import driver_auth_bp

    app.register_blueprint(farmer_auth_bp)
    app.register_blueprint(driver_auth_bp)

    return app

if __name__ == "__main__":
    init_db()
    app = create_app()
    app.run(debug=True, use_reloader=True)