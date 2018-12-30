""" Flask app index """

from flask import Flask, render_template

import utils as u


APP = Flask(__name__)

# Pre load projects and blog items in order to speed up
PORTFOLIO = u.get_items("portfolio")
# Projects that will be at the main page
PORTFOLIO_MAIN = {i: data for i, data in PORTFOLIO.items() if data.get("main", False)}

# Featured projects at the end of a project
PORTFOLIO_HIGH = {i: data for i, data in PORTFOLIO.items() if data.get("highlight", False)}

BLOG = u.get_items("blog")
BLOG_HIGH = {i: data for i, data in BLOG.items() if data.get("highlight", False)}


@APP.route('/')
@APP.route('/home.html')
def home():
    """ home page """

    return render_template(
        "home.html", portfolio=PORTFOLIO_MAIN, blog=BLOG_HIGH, **u.get_page("home")
    )


@APP.route('/about.html')
def about():
    """ about me page """

    return render_template("about.html", **u.get_page("about"))


@APP.route('/portfolio.html')
def portfolio():
    """ portfolio page """

    return render_template("portfolio.html", portfolio=PORTFOLIO, **u.get_page("portfolio"))


@APP.route('/blog.html')
def blog():
    """ blog page """
    return render_template("blog.html", blog=BLOG, **u.get_page("blog"))


@APP.route('/portfolio_item/<item>')
def portfolio_item(item):
    """ portfolio item """

    name = item.split(".")[0] # No extension
    return render_template("portfolio_item.html", portfolio=PORTFOLIO_HIGH, **PORTFOLIO[name])


@APP.route('/post/<item>')
def post(item):
    """ blog item """

    name = item.split(".")[0] # No extension
    return render_template("post.html", **BLOG[name])


if __name__ == '__main__':
    APP.run(debug=True)
