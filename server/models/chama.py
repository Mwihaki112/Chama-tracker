from app import db
from datetime import datetime

class Chama(db.Model):
    __tablename__ = "chamas"

    id= db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    target_amount = db.Column(db.Float, nullable=False)
    contribution_amount = db.Column(db.Float, nullable=False)
    cycle = db.Column(db.String(50), nullable=False) # e.g., "monthly", "weekly"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Relationships
    memberships = db.relationship("Membership", back_populates="chama")
    contributions = db.relationship("Contribution", back_populates="chama")
    payouts = db.relationship("Payout", back_populates="chama")

    def to_dict(self):
        return{
            "id" : self.id,
            "name": self.name,
            "description": self.description,
            "target_amount": self.target_amount,
            "contribution_amount": self.contribution_amount,
            "cycle": self.cycle,
            "created_at": self.created_at.isoformat(),
            "created_by": self.created_by
        }