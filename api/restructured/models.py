from __init__ import db
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class Cameras(db.Model):
    __tablename__ = 'camera'

    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String)
    name = db.Column(db.String())
    location = db.Column(db.String())
    who_reset_last = db.Column(db.String)
    last_reset_date = db.Column(db.DateTime)

    def __init__(self, name, ip_address, location):
        self.name = name
        self.ip_address = ip_address
        self.location = location

    def __repr__(self):
        return f"<Camera {self.name}>"

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(32), primary_key=True, unique=True)
    username = db.Column(db.String(64), index=False, unique=True, nullable=False)
    email = db.Column(db.String(80), index=True, unique=True, nullable=False)
    password = db.Column(db.String(200), index=False, unique=False, nullable=False)
    joined_at = db.Column(db.DateTime, index=False, unique=False, nullable=True)
    admin = db.Column(db.Boolean, index=False, unique=False, nullable=False)
    last_login = db.Column(db.DateTime, index=False, unique=False, nullable=True)
    active = db.Column(db.Boolean, index=False, unique=False, nullable=False)
    _authenticated = db.Column(db.Boolean, index=False, unique=False, nullable=False)
    _anonymous = db.Column(db.Boolean, index=False, unique=False, nullable=False)

    def __init__(self, id, username, email, joined_at, admin, active=True, _authenticated=False, _anonymous=True):
        self.id = id
        self.username = username
        self.email = email
        self.joined_at = joined_at
        self.admin = admin
        self.active = active
        self._authenticated = _authenticated
        self._anonymous = _anonymous

    def get_by_id(self):
        return self

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password, method='sha256')

    def check_password(self, password):
        """Check hashed password."""
        # orig = generate_password_hash(self.password, method='sha256')
        return check_password_hash(pwhash = self.password, password = password)

    def is_active(self):
        # The is_active() method has always 
        # returning False for banned or deactivated users 
        # and those users will not be allowed to login.
        return self.active

    def set_is_active(self, bool):
        self.active = bool

    # is_anonymous() and is_authenticated() are each other's inverse.
    # When nobody is logged in Flask-Login's current_user is set to an AnonymousUser object.
    # This object responds to is_authenticated() and
    # is_active() with False and to is_anonymous() with True.

    def is_anonymous(self):
        return self._anonymous

    def is_authenticated(self):
        return self._authenticated

    def set_authenticated(self, bool):
        if bool == True:
            self.last_login = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self._anonymous = False
            self._authenticated = bool
        else:
            self._anonymous = True
            self._authenticated = bool

    def __repr__(self):
        return f"<User {self.username}>"

class CamPreset(db.Model):
    __tablename__ = 'cam_presets'

    id = db.Column(db.String(100), primary_key = True)
    name = db.Column(db.String(50), index = False, unique = True, nullable = False)
    bearer = db.Column(db.String(50), index = False, unique = False, nullable = False)
    moveset = db.Column(db.String(500), index = False, unique = False, nullable = False)

    def __init__(self, id, name, bearer, moveset):
        self.id = id
        self.name = name
        self.bearer = bearer
        self.moveset = moveset

    def get_table_name(self):
        return self.__tablename__

    def __repr__(self):
        return f"<Preset {self.name}>"