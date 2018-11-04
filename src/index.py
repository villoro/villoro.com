""" Flask app index """

import oyaml as yaml

from flask import Flask, render_template

APP = Flask(__name__)

@APP.route('/')
@APP.route('/home.html')
def home():
    """ home page """
    return render_template("home.html")


@APP.route('/about.html')
def about():
    """ about me page """
    with open('src/skills.yaml') as file:
        skills = yaml.load(file)

    tools = ["python", "jupyter", "tensorflow", "plotly", "sublime", "git"]

    return render_template("about.html", skills=skills, tools=tools)


@APP.route('/portfolio.html')
def portfolio():
    """ portfolio page """
    return render_template("portfolio.html")


@APP.route('/blog.html')
def blog():
    """ blog page """
    return render_template("blog.html")


if __name__ == '__main__':
    APP.run(debug=True)
