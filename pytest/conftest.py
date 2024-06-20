import pytest
from app import db,init_db
from models.models import Tipo, Publisher, Catalogo

@pytest.fixture(scope='module')
def test_client():
    app = create_app('testing')
    testing_client = app.test_client()

    with app.app_context():
        db.create_all()

        yield testing_client

        db.drop_all()

@pytest.fixture(scope='module')
def init_database():
    app = create_app('testing')
    with app.app_context():
        db.create_all()

        yield db

        db.drop_all()
