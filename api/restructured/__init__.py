# Import the required libraries
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from flask_session import Session

# Create various application instances
db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()
login_manager = LoginManager()
server_session = Session()

def create_app():
    """Application-factory pattern"""
    app = Flask(__name__)
<<<<<<< HEAD
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://spot:metadon@147.232.24.160:49153/smart-space-dev"
    # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
=======
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://spot:metadon@{IP}/smart-space-dev"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
>>>>>>> 5caf91801b87b26798cfc8ce131276590d781245
    app.config["SECRET_KEY"] = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiVXNlciIsIklzc3VlciI6Iklzc3VlciIsIlVzZXJuYW1lIjoiZGljayIsImV4cCI6MTY0NTAwOTQzOCwiaWF0IjoxNjQ1MDA5NDM4fQ.BlZGABPcXwDJAFuVToGrXMGOnnrF2D6k52O67_f6W-w"
    app.config['SESSION_TYPE'] = 'filesystem'

    # Initialize extensions
    # To use the application instances above, instantiate with an application:
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    login_manager.init_app(app)
    server_session.init_app(app)
    cors.init_app(app, supports_credentials=True)
    
    return app
