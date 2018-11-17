""" Flask app index """

import os
from collections import OrderedDict

import oyaml as yaml
from markdown import markdown

PATH_CONTENT = "src/content/"


def get_yaml(name):
    """ Get data from yaml as ordered dict """

    with open("{}{}.yaml".format(PATH_CONTENT, name)) as file:
        out = yaml.load(file)

    # Transform from makrdown to html if needed
    for name, data in out.items():
        if ("markdown" in data) and ("text" in data):
            out[name] = markdown(data["text"])

    return out

def get_portfolio():
    """ Return list of portfolio items with info as dict"""

    out = OrderedDict()

    for filename in os.listdir(PATH_CONTENT + "portfolio"):
        num, name = filename.split("-")

        # Strip extensions
        name = name.split(".")[0]

        with open('{}portfolio/{}-{}.yaml'.format(PATH_CONTENT, num, name)) as file:
            out[name] = yaml.load(file)

        # Transform some blocks from markdown to html
        for x in ["brief", "results"]:
            out[name][x] = markdown(out[name][x])

    return out
