from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "super-secret-key"

bcrypt = Bcrypt(app)

jwt = JWTManager(app)


app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "sqlite:///nutriai.db"
)
db = SQLAlchemy(app)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization"],
)
# 🔑 Your API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    age = db.Column(db.Integer)

    gender = db.Column(db.String(20))

    height = db.Column(db.Float)

    weight = db.Column(db.Float)

    activity = db.Column(db.String(50))

    goal = db.Column(db.String(50))

    dietary_preference = db.Column(db.String(100))

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )
    macro_history = db.relationship(
        "MacroHistory",
        backref="user",
        lazy=True
    )


class MacroHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    calories = db.Column(db.Integer)

    protein = db.Column(db.Integer)

    carbs = db.Column(db.Integer)

    fats = db.Column(db.Integer)

    goal = db.Column(db.String(50))

    created_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp()
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )


@app.route("/save-user", methods=["POST"])
def save_user():
    try:
        data = request.json

        user = User(
            age=int(data.get("age", 0)),

            gender=data.get("gender"),

            height=float(data.get("height", 0)),

            weight=float(data.get("weight", 0)),

            activity=data.get("activity"),

            goal=data.get("goal"),

            dietary_preference=data.get("dietaryPreference"),
        )

        db.session.add(user)

        db.session.commit()

        return jsonify({
            "message": "User saved successfully"
        })

    except Exception as e:
        print("SAVE USER ERROR:", str(e))

        return jsonify({
            "message": "Error saving user"
        }), 500


@app.route("/users", methods=["GET"])
def get_users():
    try:
        users = User.query.all()

        users_data = []

        for user in users:
            users_data.append({
                "id": user.id,
                "email": user.email,
                "password": user.password,
                "age": user.age,
                "gender": user.gender,
                "height": user.height,
                "weight": user.weight,
                "activity": user.activity,
                "goal": user.goal,
                "dietary_preference": user.dietary_preference,
            })

        return jsonify(users_data)

    except Exception as e:
        print("GET USERS ERROR:", str(e))

        return jsonify([]), 500


@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json

        email = data.get("email")

        password = data.get("password")

        # ✅ Check if user already exists
        existing_user = User.query.filter_by(
            email=email
        ).first()

        if existing_user:
            return jsonify({
                "message": "User already exists"
            }), 400

        # 🔒 Hash password
        hashed_password = bcrypt.generate_password_hash(
            password
        ).decode("utf-8")

        # 👤 Create new user
        user = User(
            email=email,

            password=hashed_password,

            age=0,
            gender="",
            height=0,
            weight=0,
            activity="",
            goal="",
            dietary_preference="",
        )

        db.session.add(user)

        db.session.commit()

        return jsonify({
            "message": "Signup successful"
        })

    except Exception as e:
        print("SIGNUP ERROR:", str(e))

        return jsonify({
            "message": "Signup failed"
        }), 500


# print(os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")


@app.route("/")
def home():
    return "Backend is running!"


@app.route("/update-user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                "message": "User not found"
            }), 404

        data = request.json

        user.age = int(data.get("age") or user.age)

        user.gender = data.get("gender") or user.gender

        user.height = float(data.get("height") or user.height)

        user.weight = float(data.get("weight") or user.weight)

        user.activity = data.get("activity") or user.activity

        user.goal = data.get("goal") or user.goal

        user.dietary_preference = (
            data.get("dietary_preference")
            or user.dietary_preference
        )

        db.session.commit()

        return jsonify({
            "message": "User updated successfully"
        })

    except Exception as e:
        print("UPDATE USER ERROR:", str(e))

        return jsonify({
            "message": "Error updating user"
        }), 500





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


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json

        email = data.get("email")

        password = data.get("password")

        # 🔍 Find user
        user = User.query.filter_by(
            email=email
        ).first()

        if not user:
            return jsonify({
                "message": "Invalid email or password"
            }), 401

        # 🔒 Verify password
        password_correct = bcrypt.check_password_hash(
            user.password,
            password
        )

        if not password_correct:
            return jsonify({
                "message": "Invalid email or password"
            }), 401

        # 🎟️ Create JWT token
        access_token = create_access_token(
            identity=str(user.id)
        )

        return jsonify({
            "token": access_token,

            "user_id": user.id,

            "message": "Login successful"
        })

    except Exception as e:
        print("LOGIN ERROR:", str(e))

        return jsonify({
            "message": "Login failed"
        }), 500

@app.route("/current-user", methods=["GET"])
@jwt_required()
def current_user():

    try:

        print("CURRENT USER ROUTE HIT")

        current_user_id = get_jwt_identity()

        print("JWT ID:", current_user_id)

        user = User.query.get(
            int(current_user_id)
        )

        print("USER:", user)

        if not user:
            return jsonify({
                "message": "User not found"
            }), 404

        return jsonify({
            "id": user.id,

            "email": user.email,

            "age": user.age,

            "gender": user.gender,

            "height": user.height,

            "weight": user.weight,

            "activity": user.activity,

            "goal": user.goal,

            "dietary_preference":
                user.dietary_preference,
        })

    except Exception as e:

        print("CURRENT USER ERROR:", str(e))

        return jsonify({
            "message": "Error fetching user"
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
@jwt_required()
def calculate_macros():
    print("HEADERS:", request.headers)
    try:
        data = request.json
        current_user_id = get_jwt_identity()

        weight = float(data.get("weight") or 70)

        height = float(data.get("height") or 170)

        age = float(data.get("age") or 25)
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
        

        macro_entry = MacroHistory(
            calories=round(calories),

            protein=round(protein),

            carbs=round(carbs),

            fats=round(fats),

            goal=goal,
            user_id=int(current_user_id),
        )

        db.session.add(macro_entry)

        db.session.commit()


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



@app.route("/macro-history", methods=["GET"])
@jwt_required()
def get_macro_history():
    try:
        current_user_id = get_jwt_identity()

        history = MacroHistory.query.filter_by(
            user_id=int(current_user_id)
        ).all()

        history_data = []

        for entry in history:
            history_data.append({
                "id": entry.id,

                "calories": entry.calories,

                "protein": entry.protein,

                "carbs": entry.carbs,

                "fats": entry.fats,

                "goal": entry.goal,

                "created_at": entry.created_at,
            })

        return jsonify(history_data)

    except Exception as e:
        print("MACRO HISTORY ERROR:", str(e))

        return jsonify([]), 500




@app.route("/delete-user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try:
        user = db.session.get(User, user_id)

        if not user:
            return jsonify({
                "message": "User not found"
            }), 404

        db.session.delete(user)

        db.session.commit()

        return jsonify({
            "message": "User deleted successfully"
        })

    except Exception as e:
        print("DELETE USER ERROR:", str(e))

        return jsonify({
            "message": "Error deleting user"
        }), 500




with app.app_context():
    db.create_all()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)