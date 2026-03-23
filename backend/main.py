from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, use_reloader=True)