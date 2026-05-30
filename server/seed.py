from app import create_app, db, bcrypt
from models import User, Chama, Membership, Contribution, Payout
from datetime import datetime
from dateutil.relativedelta import relativedelta

app = create_app()

with app.app_context():
    # Clear existing data
    print("Clearing existing data...")
    Payout.query.delete()
    Contribution.query.delete()
    Membership.query.delete()
    Chama.query.delete()
    User.query.delete()
    db.session.commit()

    # Create users
    print("Creating users...")
    users = [
        User(name="Aggie", 
             email="aggie@test.com", 
             password_hash=bcrypt.generate_password_hash("pass123").decode("utf-8")),
        User(name="Wanjiru", 
             email="wanjiru@test.com", 
             password_hash=bcrypt.generate_password_hash("pass123").decode("utf-8")),
        User(name="Amina", 
             email="amina@test.com", 
             password_hash=bcrypt.generate_password_hash("pass123").decode("utf-8")),
        User(name="Njeri", 
             email="njeri@test.com", 
             password_hash=bcrypt.generate_password_hash("pass123").decode("utf-8")),
    ]
    db.session.add_all(users)
    db.session.commit()

    # Create chamas
    print("Creating chamas...")
    chama1 = Chama(
        name="Moringa Girls",
        description="Moringa school savings group",
        target_amount=100000,
        contribution_amount=2000,
        cycle="monthly",
        created_by=users[0].id
    )
    chama2 = Chama(
        name="Westlands Friends",
        description="Weekly savings group",
        target_amount=50000,
        contribution_amount=1000,
        cycle="weekly",
        created_by=users[1].id
    )
    db.session.add_all([chama1, chama2])
    db.session.commit()

    # Create memberships
    print("Creating memberships...")
    memberships = [
        Membership(user_id=users[0].id, chama_id=chama1.id, role="admin"),
        Membership(user_id=users[1].id, chama_id=chama1.id, role="member"),
        Membership(user_id=users[2].id, chama_id=chama1.id, role="member"),
        Membership(user_id=users[3].id, chama_id=chama1.id, role="member"),
        Membership(user_id=users[1].id, chama_id=chama2.id, role="admin"),
        Membership(user_id=users[0].id, chama_id=chama2.id, role="member"),
    ]
    db.session.add_all(memberships)
    db.session.commit()

    # Create contributions
    print("Creating contributions...")
    contributions = [
        Contribution(user_id=users[0].id, chama_id=chama1.id, amount=2000, notes="January contribution"),
        Contribution(user_id=users[1].id, chama_id=chama1.id, amount=2000, notes="January contribution"),
        Contribution(user_id=users[2].id, chama_id=chama1.id, amount=2000, notes="January contribution"),
        Contribution(user_id=users[0].id, chama_id=chama2.id, amount=1000, notes="Week 1 contribution"),
    ]
    db.session.add_all(contributions)
    db.session.commit()

    # Create payouts
    print("Creating payouts...")
    start_date = datetime(2026, 6, 1)
    members_in_order = Membership.query.filter_by(chama_id=chama1.id).order_by(Membership.joined_at).all()

    for i, member in enumerate(members_in_order):
        payout = Payout(
            chama_id=chama1.id,
            recipient_id=member.user_id,
            amount=8000,
            payout_date=start_date + relativedelta(months=i),
            status="pending"
        )
        db.session.add(payout)

    db.session.commit()
    print("Seeding complete!")