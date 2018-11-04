""" Flask app index """

import json

from flask import Flask, render_template

APP = Flask(__name__)

@APP.route('/')
@APP.route('/home.html')
def home():
    return render_template("home.html")

@APP.route('/about.html')
def about():
    with open('skills.json') as file:
        return render_template("about.html", skills=json.load(file))

@APP.route('/portfolio.html')
def portfolio():
    return render_template("portfolio.html")

@APP.route('/blog.html')
def blog():
    return render_template("blog.html")


if __name__ == '__main__':
    APP.run(debug=True)
