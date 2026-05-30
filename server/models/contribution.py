from app import db
from datetime import datetime

class Contribution(db.Model):
    __tablename__ = "contributions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    chama_id = db.Column(db.Integer, db.ForeignKey("chamas.id"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    paid_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.String(255)) # Optional notes about the contribution

    # Relationships
    user = db.relationship("User", back_populates="contributions")
    chama = db.relationship("Chama", back_populates="contributions")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "chama_id": self.chama_id,
            "amount": self.amount,
            "paid_at": self.paid_at.isoformat(),
            "notes": self.notes
        }