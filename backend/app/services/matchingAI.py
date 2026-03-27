from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# PROMPTS



def match_drivers(drivers, produce_details) -> dict:
    system_prompt = """
    You are an expert logistics coordinator for "FarmDrive," an agricultural transport platform.
    Your task is to analyze a list of driver bids for a specific farm produce and rank them.
    
    Criteria for ranking:
    1. Distance: Closer drivers are preferred for faster pickup and lower fuel consumption.
    2. Price: Lower bids are better for the farmer's margin.
    3. Feasibility: Compare the quantity/details with the driver's capability (implied).

    You must return ONLY a JSON object with a key 'ranked_drivers' containing an array of objects.
    Each object must include the original driver data plus a field 'ai_note' explaining why they were ranked in that position.
    """

    user_content = f"""
    PRODUCE TO TRANSPORT:
    - Crop: {produce_details['crop_name']}
    - Quantity: {produce_details['quantity']}
    - Route: {produce_details['pickup_location']} to {produce_details['destination']}
    - Details: {produce_details['details']}

    DRIVER BIDS:
    {drivers}

    Return the ranked list from best to worst match.
    """
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ],
        temperature=1,
        response_format={}
    )

    return response.choices[0].message.content
