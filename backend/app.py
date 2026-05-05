from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# 🔑 Your OpenAI API key
client = OpenAI(api_key="YOUR_KEY")


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
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                timeout=10
            )

            meal_plan = response.choices[0].message.content

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


if __name__ == "__main__":
    app.run(debug=True)