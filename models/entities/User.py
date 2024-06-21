from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class (db.Model, UserMixin):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)  
    fullname = db.Column(db.String(100), nullable=False)
    @classmethod
    def create(cls, id=None, username=None, password=None, fullname=""):
        if id is not None:
            new_user = cls(id=id, username=username, password=generate_password_hash(password), fullname=fullname)
        else:
            new_user = cls(username=username, password=generate_password_hash(password), fullname=fullname)
        return new_user

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @staticmethod
    def generate_password(password):
        return generate_password_hash(password, method='pbkdf2:sha256')
