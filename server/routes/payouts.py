from flask import Blueprint, request, jsonify
from app import db
from models import Payout, Membership, Chama
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from dateutil.relativedelta import relativedelta

payouts_bp = Blueprint("payouts", __name__)

# Get payout schedule for a chama
@payouts_bp.route("/<int:chama_id>/payouts", methods=["GET"])
@jwt_required()
def get_payouts(chama_id):
    payouts = Payout.query.filter_by(chama_id=chama_id).all()
    return jsonify([p.to_dict() for p in payouts]), 200

# Generate payout schedule based on join order
@payouts_bp.route("/<int:chama_id>/payouts/generate", methods=["POST"])
@jwt_required()
def generate_payouts(chama_id):
    user_id = get_jwt_identity()

    # Only admins can generate payouts
    membership = Membership.query.filter_by(user_id=user_id, chama_id=chama_id, role="admin").first()
    if not membership:
        return jsonify({"error": "Only admins can generate payouts"}), 403

    # Get members ordered by join date
    members = Membership.query.filter_by(chama_id=chama_id).order_by(Membership.joined_at).all()

    if not members:
        return jsonify({"error": "No members found"}), 404

    # Get chama to check cycle
    chama = Chama.query.get(chama_id)

    data = request.get_json()
    amount = data.get("amount")
    start_date = datetime.fromisoformat(data.get("start_date"))

    if not amount or not start_date:
        return jsonify({"error": "Amount and start date are required"}), 400

    # Clear existing payouts for this chama
    Payout.query.filter_by(chama_id=chama_id).delete()

    payouts = []
    for i, member in enumerate(members):
        if chama.cycle == "weekly":
            payout_date = start_date + relativedelta(weeks=i)
        else:
            payout_date = start_date + relativedelta(months=i)

        payout = Payout(
            chama_id=chama_id,
            recipient_id=member.user_id,
            amount=amount,
            payout_date=payout_date,
            status="pending"
        )
        db.session.add(payout)
        payouts.append(payout)

    db.session.commit()
    return jsonify({"message": "Payout schedule generated", "payouts": [p.to_dict() for p in payouts]}), 201