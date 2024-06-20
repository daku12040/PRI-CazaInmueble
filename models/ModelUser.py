from .entities.User import User

class ModelUser:

    @classmethod
    def login(cls, db, user):
        try:
            cursor = db.connection.cursor()
            sql = """SELECT id, username, password, fullname FROM user 
                    WHERE username = '{}'""".format(user.username)
            cursor.execute(sql)
            row = cursor.fetchone()
            if row is not None:
                user_from_db = User(row[0], row[1], row[2], row[3])  # Crear instancia de User con los datos de la base de datos
                if user_from_db.check_password(user.password):  # Verificar la contraseña
                    return user_from_db
                else:
                    return None
            else:
                return None
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_by_id(cls, db, id):
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
    def get_by_username(cls, db, username):
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

    @staticmethod
    def register(db, user):
        cursor = db.connection.cursor()
        try:
            cursor.execute("INSERT INTO user (username, password, fullname) VALUES (%s, %s, %s)",
                           (user.username, user.password, user.fullname))
            db.connection.commit()
            return True
        except Exception as e:
            print(f"Error while registering user: {e}")
            db.connection.rollback()
            return False
        finally:
            cursor.close()

