from app.database.db_functions import get_delivery_context
from groq import Groq
from dotenv import load_dotenv
import os
import json


load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_destination_location(delivery_id) -> dict:
    # 1. Fetch the actual destination from DB
    delivery = get_delivery_context(delivery_id)

    if not delivery:
        return {"status": "ERROR", 
                "message": "Delivery not found.", 
                "code": 404}

    destination = delivery['destination']
    crop = delivery['crop_name']

    # 2. AI Prompt to find the specific market
    system_prompt = f"""
    You are a Nigerian Logistics GIS. Identify the major agricultural market 
    in {destination} that specializes in {crop}.
    
    RULES:
    - Return ONLY a JSON object.
    - Provide accurate Latitude (lat) and Longitude (lng).
    - If no specific market exists for {crop}, provide the main food market in {destination}.
    
    STRUCTURE:
    {{
      "market_name": "string",
      "lat": number,
      "lng": number
    }}
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", 
                       "content": system_prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )

        ai_data = json.loads(response.choices[0].message.content)
        return {"status": "SUCCESS", 
                "code": 200, 
                "data": ai_data}

    except Exception as e:
        return {"status": "ERROR", 
                "message": f"Error fetching destination coordinates: {e}.", 
                "code": 500}
