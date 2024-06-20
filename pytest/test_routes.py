import pytest
from app import app, db
from models.models import Catalogo, Tipo

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            # Insertar datos de prueba
            tipo1 = Tipo(idtipo=1, nombretipo='Apartamento')
            tipo2 = Tipo(idtipo=2, nombretipo='Casa')
            db.session.add_all([tipo1, tipo2])
            db.session.commit()

            inmueble1 = Catalogo(nombre='Inmueble 1', precio=50000000, tipo=1, publisher=1, ubicacion='Ubicacion 1', fecha=datetime.now())
            inmueble2 = Catalogo(nombre='Inmueble 2', precio=150000000, tipo=2, publisher=2, ubicacion='Ubicacion 2', fecha=datetime.now())
            db.session.add_all([inmueble1, inmueble2])
            db.session.commit()
        yield client

def test_preview_inmuebles(client):
    response = client.get('/preview?precio=100000000')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['nombre'] == 'Inmueble 1'

    response = client.get('/preview?tipo=2')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['nombre'] == 'Inmueble 2'

    response = client.get('/preview?precio=100000000&tipo=2')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 0

if __name__ == '__main__':
    pytest.main()
