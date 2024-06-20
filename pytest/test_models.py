import pytest
from myapp import db
from myapp.models.models import Catalogo, Tipo, Publisher
from datetime import datetime

def test_tipo_model(init_database):
    tipo = Tipo(nombretipo='Apartamento')
    db.session.add(tipo)
    db.session.commit()

    retrieved_tipo = Tipo.query.filter_by(nombretipo='Apartamento').first()
    assert retrieved_tipo is not None
    assert retrieved_tipo.nombretipo == 'Apartamento'

def test_publisher_model(init_database):
    publisher = Publisher(nombrepublisher='Publisher Test')
    db.session.add(publisher)
    db.session.commit()

    retrieved_publisher = Publisher.query.filter_by(nombrepublisher='Publisher Test').first()
    assert retrieved_publisher is not None
    assert retrieved_publisher.nombrepublisher == 'Publisher Test'

def test_catalogo_model(init_database):
    tipo = Tipo(nombretipo='Apartamento')
    publisher = Publisher(nombrepublisher='Publisher Test')
    db.session.add(tipo)
    db.session.add(publisher)
    db.session.commit()

    catalogo = Catalogo(
        nombre='Test Inmueble',
        precio=1000000,
        tipo=tipo.idtipo,
        ubicacion='Test Location',
        publisher=publisher.idpublisher,
        fecha=datetime.now()
    )
    db.session.add(catalogo)
    db.session.commit()

    retrieved_catalogo = Catalogo.query.filter_by(nombre='Test Inmueble').first()
    assert retrieved_catalogo is not None
    assert retrieved_catalogo.precio == 1000000
    assert retrieved_catalogo.tipo_rel.nombretipo == 'Apartamento'
    assert retrieved_catalogo.publisher_rel.nombrepublisher == 'Publisher Test'
    assert retrieved_catalogo.ubicacion == 'Test Location'
