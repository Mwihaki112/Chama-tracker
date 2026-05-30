from flask import Blueprint, request, jsonify
from app import db
from models import Chama, Membership, Contribution, Payout
from flask_jwt_extended import jwt_required, get_jwt_identity

chamas_bp = Blueprint("chamas", __name__)

# GET all chamas
@chamas_bp.route("/", methods=["GET"])
@jwt_required()
def get_chamas():
    chama = Chama.query.all()
    return jsonify({"chamas": [c.to_dict() for c in chama]}), 200


# Create a new chama
@chamas_bp.route("/", methods=["POST"])
@jwt_required()
def create_chama():
    user_id = get_jwt_identity()
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")
    target_amount = data.get("target_amount")
    contribution_amount = data.get("contribution_amount")
    cycle = data.get("cycle")

    if not name or not target_amount or not contribution_amount or not cycle:
        return jsonify({"error": "Name, target amount, contribution amount, and cycle are required"}), 400
    
    chama  = Chama(
        name=name,
        description=description,
        target_amount=target_amount,
        contribution_amount=contribution_amount,
        cycle=cycle,
        created_by=user_id
    )
    db.session.add(chama)
    db.session.flush()

    # Creator becomes admin member
    membership = Membership(
        user_id=user_id,
        chama_id=chama.id,
        role="admin"
    )
    db.session.add(membership)
    db.session.commit()

    return jsonify({"message": "Chama created successfully", 
            "chama": chama.to_dict()}), 201

# GET one chama by id
@chamas_bp.route("/<int:chama_id>", methods=["GET"])
@jwt_required()
def get_chama(chama_id):
    user_id = get_jwt_identity()

    chama = Chama.query.get(chama_id)
    if not chama:
        return jsonify({"error": "Chama not found"}), 404

    members = Membership.query.filter_by(chama_id=chama_id).all()
    current_membership = Membership.query.filter_by(user_id=user_id, chama_id=chama_id).first()
    return jsonify({
        "chama": chama.to_dict(),
        "members": [m.to_dict() for m in members],
        "is_member": current_membership is not None,
        "is_admin": current_membership.role == "admin" if current_membership else False
    }), 200

# Update a chama
@chamas_bp.route("/<int:chama_id>", methods=["PUT"])
@jwt_required()
def update_chama(chama_id):
    user_id = get_jwt_identity()

    chama = Chama.query.get(chama_id)
    if not chama:
        return jsonify({"error": "Chama not found"}), 404

    membership = Membership.query.filter_by(user_id=user_id, chama_id=chama_id, role="admin").first()
    if not membership:
        return jsonify({"error": "Only admins can update a chama"}), 403

    data = request.get_json()
    chama.name = data.get("name", chama.name)
    chama.description = data.get("description", chama.description)
    chama.target_amount = data.get("target_amount", chama.target_amount)
    chama.contribution_amount = data.get("contribution_amount", chama.contribution_amount)
    chama.cycle = data.get("cycle", chama.cycle)

    db.session.commit()
    return jsonify({"message": "Chama updated successfully", "chama": chama.to_dict()}), 200   

# Get chamas for current user
@chamas_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_chama():
    user_id = get_jwt_identity()

    memberships = Membership.query.filter_by(user_id=user_id).all()
    chama_ids = [m.chama_id for m in memberships]
    chamas = Chama.query.filter(Chama.id.in_(chama_ids)).all()
    return jsonify([c.to_dict() for c in chamas]), 200



# DELETE a chama
@chamas_bp.route("/<int:chama_id>", methods=["DELETE"])
@jwt_required()
def delete_chama(chama_id):
    user_id = get_jwt_identity()
    chama = Chama.query.get(chama_id)
    if not chama:
        return jsonify({"error": "Chama not found"}), 404
    
    membership = Membership.query.filter_by(user_id=user_id, chama_id=chama_id, role="admin").first()
    if not membership:
        return jsonify({"error": "Only admins can delete a chama"}), 403
    
    # Delete all related memberships, contributions, and payouts
    Membership.query.filter_by(chama_id=chama_id).delete()
    Contribution.query.filter_by(chama_id=chama_id).delete()
    Payout.query.filter_by(chama_id=chama_id).delete()
    
    db.session.delete(chama)
    db.session.commit()

    return jsonify({"message": "Chama deleted successfully"}), 200

# JOIN a chama
@chamas_bp.route("/<int:chama_id>/join", methods=["POST"])
@jwt_required()
def join_chama(chama_id):
    user_id = get_jwt_identity()
    chama = Chama.query.get(chama_id)
    if not chama:
        return jsonify({"error": "Chama not found"}), 404
    
    existing = Membership.query.filter_by(user_id=user_id, chama_id=chama_id).first()
    if existing:
        return jsonify({"error": "You are already a member of this chama"}), 400
    
    membership = Membership(
        user_id=user_id,
        chama_id=chama_id,
        role="member"
    )
    db.session.add(membership)
    db.session.commit()

    return jsonify({"message": "Joined chama successfully", "membership": membership.to_dict()}), 200