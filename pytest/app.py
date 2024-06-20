from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/inmueble'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from models.modelsdef import db,init_db
from models.models import Tipo, Publisher, Catalogo

init_db(app)

def get_db_connection():
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        database='inmueble'
    )
    return connection


@app.route('/inmuebles')
def get_inmuebles():
    inmuebles = Catalogo.query.all()
    result = []
    for inmueble in inmuebles:
        item = {
            'id': inmueble.id,
            'precio': inmueble.precio,
            'nombre': inmueble.nombre,
            'tipo': inmueble.tipo_rel.nombretipo,
            'ubicacion': inmueble.ubicacion,
            'publisher': inmueble.publisher_rel.nombrepublisher if inmueble.publisher_rel else None,
            'fecha': inmueble.fecha.strftime('%Y-%m-%d')
        }
        result.append(item)
    return jsonify(result)

@app.route('/preview')
def preview_inmuebles():
    precio = request.args.get('precio', type=int)
    tipo = request.args.get('tipo', type=int)
    query = Catalogo.query
    if precio:
        query = query.filter(Catalogo.precio <= precio)
    if tipo:
        query = query.filter(Catalogo.tipo == tipo)

    inmuebles = query.all()
    result = []
    for inmueble in inmuebles:
        item = {
            'id': inmueble.id,
            'precio': inmueble.precio,
            'nombre': inmueble.nombre,
            'tipo': inmueble.tipo_rel.nombretipo,
            'ubicacion': inmueble.ubicacion
        }
        result.append(item)
    return jsonify(result)
    
@app.route('/preview_ubicacion')
def preview_inmuebles_ubicacion():
    ubicacion = request.args.get('ubicacion', type=str)
    query = Catalogo.query

    if ubicacion:
        query = query.filter(Catalogo.ubicacion.like(f'%{ubicacion}%'))
    
    inmuebles = query.all()
    result = []

    for inmueble in inmuebles:
        item = {
            'precio': inmueble.precio,
            'nombre': inmueble.nombre,
            'tipo': inmueble.tipo_rel.nombretipo,
            'ubicacion': inmueble.ubicacion
        }
        result.append(item)
    
    return jsonify(result)

@app.route('/insertar', methods=['POST'])
def insertar_catalogo():
    nombre = request.json.get('nombre')
    precio = request.json.get('precio')
    tipo = request.json.get('tipo')
    publisher = request.json.get('publisher')
    ubicacion = request.json.get('ubicacion')
    fecha = datetime.now()

    nuevo_elemento = Catalogo(nombre=nombre, precio=precio, tipo=tipo, publisher=publisher, ubicacion=ubicacion, fecha = fecha)
    db.session.add(nuevo_elemento)
    db.session.commit()

    return jsonify({'mensaje': 'Elemento insertado correctamente'}), 201


@app.route('/propiedad/<int:id>')
def mostrar_propiedad(id):
    propiedad = Catalogo.query.get_or_404(id)
    return render_template('propiedad.html', propiedad=propiedad)

@app.route('/publicar')
def publicar():
    return render_template('publicar.html')

@app.route('/ubicaciones')
def obtener_ubicaciones():
    ubicaciones = Catalogo.query.with_entities(Catalogo.ubicacion).all()
    result = [ubicacion[0] for ubicacion in ubicaciones]  
    return jsonify(result)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

