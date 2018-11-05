""" Flask app index """

import os

import oyaml as yaml
from markdown import markdown

PATH_ROOT = "src/"


def get_skills():
    """ Get skills as ordered dict """
    with open(PATH_ROOT + "skills.yaml") as file:
        return yaml.load(file)


def get_portfolio_item_data(item):
    """ Return porfolio item data as ordered dict """

    item_name = item.split(".")[0]

    with open('{}portfolio/{}.yaml'.format(PATH_ROOT, item_name)) as file:
        output = yaml.load(file)

        # Transform some blocks from markdown to html
    for x in ["brief", "results"]:
        output[x] = markdown(output[x])

    return output


def get_portfolio(max_num=4):
    """ Return list of portfolio items with info as dict"""

    return [get_portfolio_item_data(x) for x in os.listdir("src/portfolio")[:max_num]]