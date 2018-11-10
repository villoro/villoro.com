""" Flask app index """

from flask import Flask, render_template

import utils as u


APP = Flask(__name__)

PATH_ROOT = "src/"

# Pre load projects in order to speed up
PROJECTS = u.get_portfolio()
PROJECTS_HIGH = {i: data for i, data in PROJECTS.items() if data.get("highlight", False)}


@APP.route('/')
@APP.route('/home.html')
def home():
    """ home page """

    
    return render_template("home.html", portfolio=PROJECTS_HIGH)


@APP.route('/about.html')
def about():
    """ about me page """

    skills = u.get_skills()
    tools = ["python", "jupyter", "tensorflow", "plotly", "sublime", "git"]

    return render_template("about.html", skills=skills, tools=tools)


@APP.route('/portfolio.html')
def portfolio():
    """ portfolio page """

    return render_template("portfolio.html", portfolio=PROJECTS)


@APP.route('/blog.html')
def blog():
    """ blog page """
    return render_template("blog.html")


@APP.route('/portfolio_item/<item>')
def portfolio_item(item):
    """ portfolio item """

    name = item.split(".")[0] # No extension
    return render_template("portfolio_item.html", **PROJECTS[name])


if __name__ == '__main__':
    APP.run(debug=True)
