from flask_sqlalchemy import SQLAlchemy

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

        catalogos = db.relationship('Catalogo', back_populates='publisher_rel', lazy=True)


class Catalogo(db.Model):
        __tablename__ = 'catalogo'
        id = db.Column(db.Integer, primary_key=True)
        precio = db.Column(db.Float, nullable=False)
        nombre = db.Column(db.String(50), nullable=False)
        tipo = db.Column(db.Integer, db.ForeignKey('tipos.idtipo'), nullable=False)
        ubicacion = db.Column(db.String(120), nullable=False)
        publisher = db.Column(db.Integer, db.ForeignKey('publishers.idpublisher'))
        fecha = db.Column(db.DateTime, nullable=False)

        tipo_rel = db.relationship('Tipo', back_populates='catalogos')
        publisher_rel = db.relationship('Publisher', back_populates='catalogos')

def init_db(app):
    db.init_app(app)



