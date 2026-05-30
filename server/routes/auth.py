from flask import Blueprint, request, jsonify
from app import db, bcrypt
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)

# User Registration
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    # Create new user
    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(name=name, email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", 
                    "user": user.to_dict()}), 201

# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({"message": "Login successful", 
                    "access_token": access_token,
                    "user": user.to_dict()}), 200

# Get current user info
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"user": user.to_dict()}), 200

# Logout
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # In a real application, you would handle token revocation here
    return jsonify({"message": "Logout successful"}), 200    


    # {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc4MDA1NTE5MSwianRpIjoiNjkwOWY3M2ItMjIwZS00ZjQ5LThiMzMtYTViNjUyMWZhMTFkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3ODAwNTUxOTEsImNzcmYiOiJjMjI2MzA3NS0yMmMzLTQxMzQtOWRhMy1hNzFmZDA0ZmViMTQiLCJleHAiOjE3ODAwNTYwOTF9.iWR1qE_s6uMzsypuXqoCgG1VLwJcJnJ995E5pKrEWGw"