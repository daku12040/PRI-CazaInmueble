from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(UserMixin):
    
    def __init__(self, id, username, password, fullname=""):
        self.id = id
        self.username = username
        self.password = password  # Almacenar la contraseña hasheada directamente
        self.fullname = fullname

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @staticmethod
    def generate_password(password):
        return generate_password_hash(password, method='pbkdf2:sha256')
