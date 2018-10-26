""" Flask app index """

from flask import Flask, render_template

APP = Flask(__name__)

@APP.route('/')
@APP.route('/home')
def home():
    return render_template("home.html")

@APP.route('/about')
def about():
    return render_template("about.html")

@APP.route('/portfolio')
def portfolio():
    return render_template("portfolio.html")

@APP.route('/blog')
def blog():
    return render_template("blog.html")


if __name__ == '__main__':
    APP.run(debug=True)
