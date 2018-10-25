""" Flask app index """

from flask import Flask, render_template

APP = Flask(__name__)

@APP.route('/')
def hello_world():
    return render_template("base.html")


if __name__ == '__main__':
    APP.run(debug=True)
