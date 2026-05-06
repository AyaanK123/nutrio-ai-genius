from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔑 Your API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))



print(os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")


@app.route("/")
def home():
    return "Backend is running!"


@app.route("/generate-meal-plan", methods=["POST"])
def generate_meal_plan():
    try:
        data = request.json

        prompt = f"""
        Create a simple 1-day meal plan for:
        Age: {data.get('age')}
        Weight: {data.get('weight')}
        Goal: {data.get('goal')}
        Activity Level: {data.get('activity')}

        Include breakfast, lunch, dinner, and snacks.
        Keep it realistic and simple.
        """

        try:
            # 🤖 Try AI first
            response = model.generate_content(prompt)
            meal_plan = response.text

        except Exception as ai_error:
            print("AI ERROR:", str(ai_error))

            # 🟡 Fallback if AI fails
            meal_plan = """
Breakfast: Oats with milk and banana
Lunch: Rice, dal, paneer or chicken
Dinner: Chapati with vegetables
Snacks: Fruits and nuts
"""

        return jsonify({
            "meal_plan": meal_plan
        })

    except Exception as e:
        print("SERVER ERROR:", str(e))
        return jsonify({
            "meal_plan": "Error generating meal plan"
        }), 500



@app.route("/chat", methods=["POST"])
def chat():
    try:
        # 📩 Get frontend JSON
        data = request.json

        print("Received data:", data)

        user_message = data.get("message", "")

        print("User message:", user_message)

        # 🤖 Build prompt
        prompt = f"""
        You are a helpful AI nutritionist.

        User question:
        {user_message}

        Give short, practical nutrition advice.
        """

        print("Sending prompt to Gemini...")

        # 🚀 Gemini API call
        response = model.generate_content(prompt)

        print("Gemini response received")

        print(response)

        # 🧠 Extract text
        reply = response.text

        print("Final reply:", reply)

        # ✅ Return JSON response
        return jsonify({
            "reply": reply
        })

    except Exception as e:
        print("CHAT ROUTE ERROR:", str(e))

        fallback_reply = """
    Vegetarian protein foods include:
    - Paneer
    - Tofu
    - Lentils
    - Chickpeas
    - Greek yogurt
    - Soy chunks
    - Milk
    - Nuts and seeds
    """

        return jsonify({
            "reply": fallback_reply
        })

if __name__ == "__main__":
    app.run(debug=True)