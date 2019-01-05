""" Flask app index """

import os
from collections import OrderedDict

import oyaml as yaml
from markdown import markdown

PATH_CONTENT = "src/content/"

NUM_SEPARATOR = "-"

MARKDOWN_BLOCKS = {
    "portfolio": ["brief", "results"],
    "blog": ["content"]
}

def _read_yaml(uri):
    """ auxiliar function to raad a yaml """

    with open(uri, encoding='utf-8') as file:
        return yaml.load(file)


def _transform_markdown(text):
    """ auxiliar function to transform markdown to html """

    return markdown(text, extensions=["fenced_code", "codehilite"])


def get_page(name):
    """ Get data from yaml as ordered dict """

    out = _read_yaml(f"{PATH_CONTENT}pages/{name}.yaml")

    # Transform from makrdown to html if needed
    for name, data in out.items():
        if ("markdown" in data) and ("text" in data):
            out[name] = _transform_markdown(data["text"])

    return out


def get_items(group):
    """
        Return list of items with info as dict

        Args:
            group:  wether to return portfolio or blog entries [portfolio/blog]
    """

    assert(group in MARKDOWN_BLOCKS.keys())

    out = OrderedDict()

    for filename in reversed(os.listdir(PATH_CONTENT + group)):
        num, name = filename.split(NUM_SEPARATOR)

        # Strip extensions
        name = name.split(".")[0]

        out[name] = _read_yaml(f"{PATH_CONTENT}{group}/{num}-{name}.yaml")

        # Transform some blocks from markdown to html
        for x in MARKDOWN_BLOCKS[group]:
            out[name][x] = _transform_markdown(out[name][x])

    return out


def get_all_items():
    """ Read all portfolio and blog items and split highlited """

    out = {}

    for x in MARKDOWN_BLOCKS.keys():
        out[x] = get_items(x)

        # Add highlited items as a new entry
        out[f"{x}_high"] = {i: data for i, data in out[x].items() if data.get("highlight", False)}


    # Projects that will be at the main page
    out["portfolio_main"] = {
        i: data for i, data in out["portfolio"].items() if data.get("main", False)
    }

    num_portfolio_main = len(out["portfolio_main"])

    # At home page there should be a multiple of 4 portfolio items (and at least 4 of them)
    assert((num_portfolio_main % 4 == 0) and (num_portfolio_main > 0))

    return out