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



# print(os.getenv("GEMINI_API_KEY"))

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





@app.route("/weekly-plan", methods=["POST"])
def weekly_plan():
    try:
        data = request.json

        goal = data.get("goal", "maintain")

        weekly_meals = {
            "Monday": {
                "Breakfast": "Oats with banana",
                "Lunch": "Rice, dal, paneer",
                "Dinner": "Chapati with vegetables"
            },

            "Tuesday": {
                "Breakfast": "Poha with peanuts",
                "Lunch": "Chicken rice bowl",
                "Dinner": "Paneer salad"
            },

            "Wednesday": {
                "Breakfast": "Greek yogurt with fruits",
                "Lunch": "Dal khichdi",
                "Dinner": "Tofu stir fry"
            },

            "Thursday": {
                "Breakfast": "Smoothie with oats",
                "Lunch": "Rajma rice",
                "Dinner": "Chapati and sabzi"
            },

            "Friday": {
                "Breakfast": "Eggs and toast",
                "Lunch": "Paneer wrap",
                "Dinner": "Rice with curry"
            },

            "Saturday": {
                "Breakfast": "Upma",
                "Lunch": "Chicken salad",
                "Dinner": "Soup and bread"
            },

            "Sunday": {
                "Breakfast": "Pancakes and fruits",
                "Lunch": "Biryani",
                "Dinner": "Light salad"
            }
        }

        return jsonify({
            "weekly_plan": weekly_meals
        })

    except Exception as e:
        print("WEEKLY PLAN ERROR:", str(e))

        return jsonify({
            "weekly_plan": {}
        }), 500


@app.route("/calculate-macros", methods=["POST"])
def calculate_macros():
    try:
        data = request.json

        weight = float(data.get("weight", 70))
        height = float(data.get("height", 170))
        age = float(data.get("age", 25))
        activity = data.get("activity", "moderate")
        goal = data.get("goal", "maintain")

        # 🔥 BMR Calculation (Mifflin-St Jeor)
        bmr = 10 * weight + 6.25 * height - 5 * age + 5

        # 🏃 Activity multiplier
        activity_multipliers = {
            "sedentary": 1.2,
            "moderate": 1.55,
            "active": 1.725,
        }

        calories = bmr * activity_multipliers.get(activity, 1.55)

        # 🎯 Goal adjustment
        if goal == "loss":
            calories -= 400
        elif goal == "gain":
            calories += 400

        # 🍗 Macros
        protein = weight * 2
        fats = weight * 0.8
        carbs = (calories - (protein * 4 + fats * 9)) / 4

        return jsonify({
            "calories": round(calories),
            "protein": round(protein),
            "carbs": round(carbs),
            "fats": round(fats),
        })

    except Exception as e:
        print("MACRO ERROR:", str(e))

        return jsonify({
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fats": 0,
        }), 500


if __name__ == "__main__":
    app.run(debug=True)