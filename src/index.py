""" Flask app index """

from flask import Flask

APP = Flask(__name__)

@APP.route('/')
def hello_world():
    return 'Hello, World!'


if __name__ == '__main__':
    APP.run(debug=True)
