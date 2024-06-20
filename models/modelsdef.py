from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


db = SQLAlchemy()


class Tipo(db.Model):
        __tablename__ = 'tipos'
        idtipo = db.Column(db.Integer, primary_key=True)
        nombretipo = db.Column(db.String(50), nullable=False)

        catalogos = db.relationship('Catalogo', back_populates='tipo_rel', lazy=True)


class Publisher(db.Model):
        __tablename__ = 'publishers'
        idpublisher = db.Column(db.Integer, primary_key=True)
        nombrepublisher = db.Column(db.String(50), nullable=False)
        #imgpublisher = db.Column(db.String(120), nullable=True)

        catalogos = db.relationship('Catalogo', back_populates='publisher_rel', lazy=True)
        @classmethod
        def create(cls, nombrepublisher):
            new_publisher = cls(nombrepublisher=nombrepublisher)
            try:
                db.session.add(new_publisher)
                db.session.commit()
                return new_publisher
            except SQLAlchemyError as e:
                db.session.rollback()
                raise e


class Catalogo(db.Model):
        __tablename__ = 'catalogo'
        id = db.Column(db.Integer, primary_key=True)
        precio = db.Column(db.Float, nullable=False)
        nombre = db.Column(db.String(50), nullable=False)
        tipo = db.Column(db.Integer, db.ForeignKey('tipos.idtipo'), nullable=False)
        ubicacion = db.Column(db.String(120), nullable=False)
        publisher = db.Column(db.Integer, db.ForeignKey('publishers.idpublisher'))
        fecha = db.Column(db.DateTime, nullable=False)
        descripcion = db.Column(db.String(300), nullable=True) 

        tipo_rel = db.relationship('Tipo', back_populates='catalogos')
        publisher_rel = db.relationship('Publisher', back_populates='catalogos')

class User(db.Model, UserMixin):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)  
    fullname = db.Column(db.String(100), nullable=False)

    @classmethod
    def create(cls, username, password, fullname):
        hashed_password = generate_password_hash(password)
        new_user = cls(username=username, password=hashed_password, fullname=fullname)
        return new_user

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @staticmethod
    def generate_password(password):
        return generate_password_hash(password, method='pbkdf2:sha256')

def init_db(app):
    db.init_app(app)



