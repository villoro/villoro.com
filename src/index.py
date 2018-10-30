""" Flask app index """

from flask import Flask, render_template

APP = Flask(__name__)

@APP.route('/')
@APP.route('/home.html')
def home():
    return render_template("home.html")

@APP.route('/about.html')
def about():
    return render_template("about.html")

@APP.route('/portfolio.html')
def portfolio():
    return render_template("portfolio.html")

@APP.route('/blog.html')
def blog():
    return render_template("blog.html")


if __name__ == '__main__':
    APP.run(debug=True)
