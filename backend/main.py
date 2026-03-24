from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
import cloudinary
from app.database.db import init_db

load_dotenv()

CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDNINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    cloudinary.config(
        cloud_name=CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDNINARY_API_SECRET,
        secure=True
    )

    from app.routes.farmer.auth import farmer_auth_bp
    from app.routes.driver.auth import driver_auth_bp
    from app.routes.produce import produce_bp
    from app.routes.price import price_bp

    app.register_blueprint(farmer_auth_bp)
    app.register_blueprint(driver_auth_bp)
    app.register_blueprint(produce_bp)
    app.register_blueprint(price_bp)

    return app

if __name__ == "__main__":
    init_db()
    app = create_app()
    app.run(debug=True, use_reloader=True)