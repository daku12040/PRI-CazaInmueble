from .modelsdef import db, User 
from werkzeug.security import generate_password_hash, check_password_hash
#from .entities.User import User

class ModelUser:

    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    fullname = db.Column(db.String(100), nullable=False)

    @classmethod
    def login(cls, username, password):
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            return user
        return None

    def get_id(self):
        return str(self.id)

    @classmethod
    def get_by_id(cls, id):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT id, username, fullname FROM user WHERE id = {}".format(id)
            cursor.execute(sql)
            row = cursor.fetchone()
            if row is not None:
                return User(row[0], row[1], None, row[2])
            else:
                return None
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_by_username(cls, username):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT id, username, password, fullname FROM user WHERE username = '{}'".format(username)
            cursor.execute(sql)
            row = cursor.fetchone()
            if row is not None:
                return User(row[0], row[1], row[2], row[3])
            else:
                return None
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def create(cls, id=None, username=None, password=None, fullname=""):
        if id is not None:
            new_user = cls(id=id, username=username, password=generate_password_hash(password), fullname=fullname)
        else:
            new_user = cls(username=username, password=generate_password_hash(password), fullname=fullname)
        return new_user
 	
    @staticmethod
    def register(user):
        try:
            db.session.add(user)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Error while registering user: {e}")
            db.session.rollback()
            return False
    @staticmethod
    def get_by_username(username):
        try:
            user = User.query.filter_by(username=username).first()
            return user
        except Exception as e:
            print(f"An error occurred while getting the user: {e}")
            return None

