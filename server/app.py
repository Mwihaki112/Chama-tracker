from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    from models import User, Chama, Membership, Contribution, Payout
    from routes.contributions import contributions_bp
    from routes.payouts import payouts_bp

    from routes.auth import auth_bp
    from routes.chamas import chamas_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(chamas_bp, url_prefix='/chamas')
    app.register_blueprint(contributions_bp, url_prefix='/chamas')
    app.register_blueprint(payouts_bp, url_prefix='/chamas')
    
    with app.app_context():
        db.create_all()
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)