from app import db
from datetime import datetime
# M to M
class Membership(db.Model):
    __tablename__ = "memberships"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    chama_id = db.Column(db.Integer, db.ForeignKey("chamas.id"), nullable=False)
    role = db.Column(db.String(50), default="member") # e.g., "admin", "member"
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", back_populates="memberships")
    chama = db.relationship("Chama", back_populates="memberships")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "chama_id": self.chama_id,
            "role": self.role,
            "joined_at": self.joined_at.isoformat()
        }