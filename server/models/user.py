from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ ="users"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    memberships= db.relationship("Membership", back_populates="user")
    contributions = db.relationship("Contribution", back_populates="user")
    payouts = db.relationship("Payout", back_populates="recipient")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }

#   {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc4MDA2NTEyOSwianRpIjoiNThjYjUwNzMtMjA0MS00OGFiLTljMzItZWE3MjFmY2JmNGE2IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3ODAwNjUxMjksImNzcmYiOiJkOWI0MjJkYy1iYjkwLTQ3MzUtOTQ3MS04NjMyYjhkODhkZjUiLCJleHAiOjE3ODAwNjYwMjl9.XTS14GXFivlcsd6JSlBdQDiiCK1c6e1CJ5RGgQhOdxk"      