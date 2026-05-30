from flask import Blueprint, request, jsonify
from app import db
from models import Contribution, Membership
from flask_jwt_extended import jwt_required, get_jwt_identity

contributions_bp = Blueprint("contributions", __name__)

# Get all contributions for a chama
@contributions_bp.route("/<int:chama_id>/contributions", methods=["GET"])
@jwt_required()
def get_contributions(chama_id):
    contributions = Contribution.query.filter_by(chama_id=chama_id).all()
    return jsonify([c.to_dict() for c in contributions]), 200

# Log a contribution
@contributions_bp.route("/<int:chama_id>/contributions", methods=["POST"])
@jwt_required()
def add_contribution(chama_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    amount = data.get("amount")
    notes = data.get("notes")

    if not amount:
        return jsonify({"error": "Amount is required"}), 400

    # Check user is a member of this chama
    membership = Membership.query.filter_by(user_id=user_id, chama_id=chama_id).first()
    if not membership:
        return jsonify({"error": "You are not a member of this chama"}), 403

    contribution = Contribution(
        user_id=user_id,
        chama_id=chama_id,
        amount=amount,
        notes=notes
    )
    db.session.add(contribution)
    db.session.commit()

    return jsonify({"message": "Contribution logged successfully", "contribution": contribution.to_dict()}), 201