from flask import Flask, render_template, jsonify, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin


app = Flask(__name__)
app.config['SECRET_KEY'] = 'a_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/inmueble'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from models.modelsdef import db,init_db
from models.models import Tipo, Publisher, Catalogo, User
from models.ModelUser import ModelUser
#from models.entities.User import User

login_manager = LoginManager()
login_manager.init_app(app)

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



@app.route('/search', methods=['GET'])
def search():
    precios = request.args.get('precios')
    tipos = request.args.get('tipos')
    search_term = request.args.get('search')

    query = Catalogo.query

    if precios:
        precios = precios.split(',')
        conditions = []
        for precio in precios:
            if precio == '100-300':
                conditions.append(Catalogo.precio.between(100000000, 300000000))
            elif precio == '300-500':
                conditions.append(Catalogo.precio.between(300000000, 500000000))
            elif precio == '500-800':
                conditions.append(Catalogo.precio.between(500000000, 800000000))
            elif precio == '800+':
                conditions.append(Catalogo.precio >= 800000000)
        query = query.filter(or_(*conditions))
    
    if tipos:
        tipos = tipos.split(',')
        query = query.filter(Catalogo.tipo_id.in_(tipos))

    if search_term:
        search_condition = Catalogo.nombre.ilike(f"%{search_term}%") | Catalogo.ubicacion.ilike(f"%{search_term}%")
        query = query.filter(search_condition)

    publicaciones = query.all()

    result = []
    for pub in publicaciones:
        item = {
            'id': pub.id,
            'nombre': pub.nombre,
            'precio': pub.precio,
            'tipo': pub.tipo_rel.nombretipo,
            'ubicacion': pub.ubicacion
        }
        result.append(item)

    return render_template('search.html', publicaciones=result)

@app.route('/insertar', methods=['POST'])
def insertar_catalogo():
    nombre = request.json.get('nombre')
    precio = request.json.get('precio')
    tipo = request.json.get('tipo')
    publisher = request.json.get('publisher')
    ubicacion = request.json.get('ubicacion')
    descripcion = request.json.get('descripcion') 
    fecha = datetime.now()

    nuevo_elemento = Catalogo(
        nombre=nombre, 
        precio=precio, 
        tipo=tipo, 
        publisher=publisher, 
        ubicacion=ubicacion, 
        descripcion=descripcion, 
        fecha=fecha)
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
    return User.query.get(int(user_id))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        fullname = request.form['fullname']

        existing_user = ModelUser.get_by_username(username)
        if existing_user:
            flash("Username already exists. Please choose a different username.")
            return render_template('auth/register.html')

        hashed_password = User.generate_password(password)
        try:
            new_user = User.create(username=username, password=hashed_password, fullname=fullname)
            db.session.add(new_user)
            db.session.commit()

            parts = fullname.split(' - ')
            if len(parts) != 2:
                flash("Ingrese el nombre de su inmobiliaria! '- Nombre Inmobiliaria'.")
                return render_template('auth/register.html')

            nombrepublisher = parts[1].strip()

            new_publisher = Publisher.create(nombrepublisher)
            flash("Usuario created con exito.")
            return redirect(url_for('login'))  
        except SQLAlchemyError as e:
            db.session.rollback()
            flash(f"Error: {str(e)}")
            return render_template('auth/register.html')

        if ModelUser.register(new_user):
            flash("Registro exitoso, intente login.")
            return redirect(url_for('login'))
        else:
            flash("Registration failed. Please try again later.")
            return render_template('auth/register.html')

    return render_template('auth/register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        print(username,password)
        user = ModelUser.login(username, password)
        
        if user:
            login_user(user)
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
    app.run(port=5000, debug=True)
    #app.run(debug=True)

