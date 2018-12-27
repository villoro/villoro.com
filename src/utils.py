""" Flask app index """

import os
from collections import OrderedDict

import oyaml as yaml
from markdown import markdown

PATH_CONTENT = "src/content/"


def get_page(name):
    """ Get data from yaml as ordered dict """

    with open(f"{PATH_CONTENT}pages/{name}.yaml") as file:
        out = yaml.load(file)

    # Transform from makrdown to html if needed
    for name, data in out.items():
        if ("markdown" in data) and ("text" in data):
            out[name] = markdown(data["text"])

    return out


def get_items(group):
    """
        Return list of items with info as dict

        Args:
            group:  wether to return portfolio or blog entries [portfolio/blog]
    """

    markdown_tags = {
        "portfolio": ["brief", "results"],
        "blog": []
    }

    out = OrderedDict()

    for filename in os.listdir(PATH_CONTENT + group):
        num, name = filename.split("-")

        # Strip extensions
        name = name.split(".")[0]

        with open(f"{PATH_CONTENT}{group}/{num}-{name}.yaml") as file:
            out[name] = yaml.load(file)

        # Transform some blocks from markdown to html
        for x in markdown_tags[group]:
            out[name][x] = markdown(out[name][x])

    return out
