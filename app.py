
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def caesar_cipher(message, shift):
    result = ""

    for char in message:
        if char.isalpha() and char.isascii():
            base = ord('A') if char.isupper() else ord('a')
            new_char = chr((ord(char) - base + shift) % 26 + base)
            result += new_char
        else:
            result += char

    return result

@app.route("/encrypt", methods=["POST"])
def encrypt():
    data = request.get_json()
    message = data.get("message", "")
    shift = int(data.get("shift", 3))

    return jsonify({"result": caesar_cipher(message, shift)})

@app.route("/decrypt", methods=["POST"])
def decrypt():
    data = request.get_json()
    message = data.get("message", "")
    shift = int(data.get("shift", 3))

    return jsonify({"result": caesar_cipher(message, -shift)})

if __name__ == "__main__":
    app.run(debug=True)
