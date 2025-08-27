from flask import Flask, jsonify
from db import get_connection
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  #permitir peticiones desde frontend

@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios") 
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

if __name__ == '__main__':
    app.run(debug=True)
