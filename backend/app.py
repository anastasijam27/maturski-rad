from flask import Flask, render_template, jsonify
import sqlite3

app = Flask(__name__, template_folder='../frontend')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sneakers')
def get_sneakers():
    conn = sqlite3.connect('schema.db') 
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sneakers")
    sneakers = cursor.fetchall()
    conn.close()
    sneaker_data = []
    for sneaker in sneakers:
        sneaker_dict = {
            'id': sneaker[0],
            'name': sneaker[1],
            'brand': sneaker[2],
            'price': sneaker[3],
            'color': sneaker[4],
            'sizeAvailable': sneaker[5],
            'imageURL': sneaker[6],
            'gender': sneaker[7]
        }
        sneaker_data.append(sneaker_dict)
    return jsonify(sneaker_data)

if __name__ == '__main__':
    app.run(debug=True)


