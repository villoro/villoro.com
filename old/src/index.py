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
        html_tab_title="Villoro",
        portfolio=content["portfolio_main"],
        blog=content["blog_main"],
        **u.get_page("home"),
    )


@APP.route("/about.html")
def about():
    """ about me page """

    return render_template("about.html", html_tab_title="Villoro - About", **u.get_page("about"))


@APP.route("/portfolio.html")
def portfolio():
    """ portfolio page """

    content = u.get_content()["portfolio"]

    # Get all possible filtering tags
    tags = u.extract_tags(content.values())

    return render_template(
        "portfolio.html",
        html_tab_title="Villoro - Portfolio",
        portfolio=content,
        tags=tags,
        **u.get_page("portfolio"),
    )


@APP.route("/blog.html")
def blog():
    """ blog page """

    content = u.get_content()["blog"]

    # Get all possible filtering tags
    tags = u.extract_tags(content.values())

    return render_template(
        "blog.html", html_tab_title="Villoro - Blog", blog=content, tags=tags, **u.get_page("blog")
    )


@APP.route("/project/<item>")
def portfolio_item(item):
    """ portfolio item """

    name = item.split(".")[0]  # No extension

    content = u.get_content()

    return render_template(
        "portfolio_item.html",
        html_tab_title=f"Villoro - {item}".replace(".html", ""),
        portfolio=content["portfolio_highlight"],
        **content["portfolio"][name],
    )


@APP.route("/post/<item>")
def post(item):
    """ blog item """

    name = item.split(".")[0]  # No extension
    return render_template(
        "post.html",
        html_tab_title=f"Villoro - {item}".replace(".html", ""),
        **u.get_content()["blog"][name],
    )


@APP.errorhandler(404)
@APP.route("/404.html")
def page_not_found():
    """ Page not found error """

    return render_template("404.html", html_tab_title="Villoro 404: Not found")


if __name__ == "__main__":
    APP.run(debug=True)
