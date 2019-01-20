""" Flask app index """

from flask import Flask, render_template

import utils as u


APP = Flask(__name__)

# Pre load projects and blog items in order to speed up
CONTENT = u.get_all_items()


@APP.route('/')
@APP.route('/home.html')
def home():
    """ home page """

    return render_template(
        "home.html",
        portfolio=CONTENT["portfolio_main"],
        blog=CONTENT["blog_high"],
        **u.get_page("home")
    )


@APP.route('/about.html')
def about():
    """ about me page """

    return render_template("about.html", **u.get_page("about"))


@APP.route('/portfolio.html')
def portfolio():
    """ portfolio page """

    return render_template(
        "portfolio.html",
        portfolio=CONTENT["portfolio"],
        **u.get_page("portfolio")
    )


@APP.route('/blog.html')
def blog():
    """ blog page """
    return render_template(
        "blog.html",
        blog=CONTENT["blog"],
        **u.get_page("blog")
    )


@APP.route('/project/<item>')
def portfolio_item(item):
    """ portfolio item """

    name = item.split(".")[0] # No extension

    return render_template(
        "portfolio_item.html",
        portfolio=CONTENT["portfolio_high"],
        **CONTENT["portfolio"][name]
    )


@APP.route('/post/<item>')
def post(item):
    """ blog item """

    name = item.split(".")[0] # No extension
    return render_template(
        "post.html",
        **CONTENT["blog"][name]
    )


if __name__ == '__main__':
    APP.run(debug=True)
