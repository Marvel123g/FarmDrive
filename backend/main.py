from flask import Flask
from flask_cors import CORS
from app.sockets.socket_manager import socketio
import app.sockets.socket_events
from dotenv import load_dotenv
import os
import cloudinary
from app.database.db import init_db

load_dotenv()

CLOUD_NAME = os.getenv("CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDNINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    cloudinary.config(cloud_name=CLOUD_NAME,
                      api_key=CLOUDINARY_API_KEY,
                      api_secret=CLOUDNINARY_API_SECRET,
                      secure=True)

    from app.routes.farmer.auth import farmer_auth_bp
    from app.routes.driver.auth import driver_auth_bp
    from app.routes.produce import produce_bp
    from app.routes.price import price_bp
    from app.routes.delivery import delivery_bp
    from app.routes.transit import transit_bp
    from app.routes.payment import payment_bp
    from app.routes.driver.stats import dstats_bp
    from app.routes.farmer.stats import fstats_bp

    app.register_blueprint(farmer_auth_bp)
    app.register_blueprint(driver_auth_bp)
    app.register_blueprint(produce_bp)
    app.register_blueprint(price_bp)
    app.register_blueprint(delivery_bp)
    app.register_blueprint(transit_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(dstats_bp)
    app.register_blueprint(fstats_bp)

    socketio.init_app(app)

    return app

app = create_app()

if __name__ == "__main__":
    init_db()
    socketio.run(app, debug=True, use_reloader=True, port=5000)
