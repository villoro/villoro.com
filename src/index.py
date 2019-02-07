""" Flask app index """

from flask import Flask, render_template

import utils as u


APP = Flask(__name__)


@APP.route("/")
@APP.route("/home.html")
def home():
    """ home page """

    content = u.get_content()

    return render_template(
        "home.html",
        portfolio=content["portfolio_main"],
        blog=content["blog_high"],
        **u.get_page("home")
    )


@APP.route("/about.html")
def about():
    """ about me page """

    return render_template("about.html", **u.get_page("about"))


@APP.route("/portfolio.html")
def portfolio():
    """ portfolio page """

    return render_template(
        "portfolio.html", portfolio=u.get_content()["portfolio"], **u.get_page("portfolio")
    )


@APP.route("/blog.html")
def blog():
    """ blog page """
    return render_template("blog.html", blog=u.get_content()["blog"], **u.get_page("blog"))


@APP.route("/project/<item>")
def portfolio_item(item):
    """ portfolio item """

    name = item.split(".")[0]  # No extension

    content = u.get_content()

    return render_template(
        "portfolio_item.html", portfolio=content["portfolio_high"], **content["portfolio"][name]
    )


@APP.route("/post/<item>")
def post(item):
    """ blog item """

    name = item.split(".")[0]  # No extension
    return render_template("post.html", **u.get_content()["blog"][name])


if __name__ == "__main__":
    APP.run(debug=True)
