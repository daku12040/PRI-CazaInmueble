from flask import Flask, render_template, jsonify, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import LoginManager, login_user, logout_user, login_required


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/inmueble'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from models.modelsdef import db,init_db
from models.models import Tipo, Publisher, Catalogo
from models.ModelUser import ModelUser
from models.entities.User import User

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
            'publisher_id': inmueble.publisher,  
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

@app.route('/publisher/<int:idpublisher>')
def mostrar_publisher(idpublisher):
    publisher = Publisher.query.get_or_404(idpublisher)
    return render_template('publisher.html', publisher=publisher)


@app.route('/ubicaciones')
def obtener_ubicaciones():
    ubicaciones = Catalogo.query.with_entities(Catalogo.ubicacion).all()
    result = [ubicacion[0] for ubicacion in ubicaciones]  
    return jsonify(result)
login_manager = LoginManager(app)

@login_manager.user_loader
def load_user(user_id):
    return ModelUser.get_by_id(db, int(user_id))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        fullname = request.form['fullname']

        existing_user = ModelUser.get_by_username(db, username)
        if existing_user:
            flash("Username already exists. Please choose a different username.")
            return render_template('auth/register.html')

        hashed_password = User.generate_password(password)
        new_user = User(id=0, username=username, password=hashed_password, fullname=fullname)

        if ModelUser.register(db, new_user):
            flash("Registration successful! Please login.")
            return redirect(url_for('login'))
        else:
            flash("Registration failed. Please try again later.")
            return render_template('auth/register.html')

    return render_template('auth/register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User(0, request.form['username'], request.form['password'])
        logged_user = ModelUser.login(db, user)
        if logged_user is not None:
            login_user(logged_user)
            return redirect(url_for('home'))
        else:
            flash("Invalid username or password.")
            return render_template('auth/login.html')
    else:
        return render_template('auth/login.html')

@app.route('/home')
@login_required
def home():
    return render_template('home.html')

@app.route('/protected')
@login_required
def protected():
    return "<h1>This is a protected view, accessible only to authenticated users.</h1>"

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))    

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

