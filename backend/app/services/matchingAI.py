from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def match_drivers(drivers, produce_details) -> dict:
    system_prompt = """
    You are a logistics engine for FarmDrive. You rank driver bids.
    
    RULES:
    1. Rank drivers based on lowest Price and shortest Distance.
    2. Output MUST be valid JSON.
    3. Use the EXACT fields provided in the input for each driver.
    4. Append a field 'ai_response' to each driver object with a 1-sentence logic for their rank.
    5. Select out of the given list of drivers and return the best 25%
    
    OUTPUT STRUCTURE:
    {
      "ranked_drivers": [
        {
          "driver_id": "string",
          "profile_picture": "string",
          "price": number,
          "driver_name": "string",
          "driver_phone": "string",
          "vehicle_type": "string",
          "rating": number,
          "driver_distance": "string",
          "time_away": "string",
          "ai_response": "string logic here",
          "ai_response_rank": integer (the level of ranking)
        }
      ]
    }
    """

    user_content = f"""
    PRODUCE: {produce_details['crop_name']} ({produce_details['quantity']})
    ROUTE: {produce_details['pickup_location']} to {produce_details['destination']}
    
    INPUT DATA:
    {drivers}
    
    Return the JSON object now.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ],
        response_format={"type": "json_object"},  # This forces JSON mode
        temperature=0.2  # Lower temperature = less hallucination/randomness
    )


    return response.choices[0].message.content
