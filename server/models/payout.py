from app import db
from datetime import datetime

class Payout(db.Model):
    __tablename__ = "payouts"

    id = db.Column(db.Integer, primary_key=True)
    chama_id = db.Column(db.Integer, db.ForeignKey("chamas.id"), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payout_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default="pending") # e.g., "pending", "completed", "failed"

    # Relationships
    chama = db.relationship("Chama", back_populates="payouts")
    recipient = db.relationship("User", back_populates="payouts")

    def to_dict(self):
        return {
            "id": self.id,
            "chama_id": self.chama_id,
            "recipient_id": self.recipient_id,
            "amount": self.amount,
            "payout_date": self.payout_date.isoformat(),
            "status": self.status
        }