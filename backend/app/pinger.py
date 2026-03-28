import requests
import datetime as dt
from flask_sqlalchemy import SQLAlchemy
current_time = dt.datetime.now()

db = SQLAlchemy()

def continuous_ping():
    url = "https://farmdrive.onrender.com/api/v1/health"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "SUCCESS":
                print(f"Ping successful: {data.get('code')}")
                print(f"Server is alive at {current_time.now()}")
        else:
            print(f"Ping not successful: {response.status_code}")
            print(f"Server is not alive at {current_time.now()}")
    except Exception as e:
        print(f"Ping failed: {e}")
