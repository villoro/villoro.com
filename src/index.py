""" Flask app index """

from markdown import markdown

import oyaml as yaml
from flask import Flask, render_template

APP = Flask(__name__)

PATH_ROOT = "src/"

@APP.route('/')
@APP.route('/home.html')
def home():
    """ home page """
    return render_template("home.html")


@APP.route('/about.html')
def about():
    """ about me page """
    with open(PATH_ROOT + "skills.yaml") as file:
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


@APP.route('/portfolio-items/<item>')
def portfolio_item(item):
    """ portfolio item """

    item_name = item.split(".")[0]

    with open('{}portfolio/{}.yaml'.format(PATH_ROOT, item_name)) as file:
        kwa = yaml.load(file)

    # Transform some blocks from markdown to html
    for x in ["brief", "results"]:
        kwa[x] = markdown(kwa[x])

    return render_template("portfolio_item.html", **kwa)


if __name__ == '__main__':
    APP.run(debug=True)
