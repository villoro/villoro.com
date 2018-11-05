""" Flask app index """

from flask import Flask, render_template

import utils as u


APP = Flask(__name__)

PATH_ROOT = "src/"

@APP.route('/')
@APP.route('/home.html')
def home():
    """ home page """

    portfolio = u.get_portfolio()
    return render_template("home.html", portfolio=portfolio)


@APP.route('/about.html')
def about():
    """ about me page """

    skills = u.get_skills()
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


@APP.route('/portfolio_item/<item>')
def portfolio_item(item):
    """ portfolio item """

    kwa = u.get_portfolio_item_data(item)
    return render_template("portfolio_item.html", **kwa)


if __name__ == '__main__':
    APP.run(debug=True)
