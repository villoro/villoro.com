""" Content utilities """

import os
from collections import OrderedDict

import oyaml as yaml
from markdown import markdown

PATH_CONTENT = "src/content/"

NUM_SEPARATOR = "-"

BLOCKS = ["portfolio", "blog"]


def _read_yaml(uri):
    """ auxiliar function to raad a yaml """

    with open(uri, encoding="utf-8") as file:
        return yaml.load(file)


def _transform_markdown(mdict):
    """ auxiliar function to transform markdown to html """

    for name, data in mdict.items():

        # If there is text and is markdown, fix it
        if isinstance(data, str) and name.endswith("_markdown"):
            mdict[name] = markdown(data, extensions=["fenced_code", "codehilite"])

        # If there is a dict, do the same
        if isinstance(data, dict):
            _transform_markdown(data)

    return mdict


def get_page(pagename):
    """ Get data from yaml as ordered dict """

    out = _read_yaml(f"{PATH_CONTENT}pages/{pagename}.yaml")

    return _transform_markdown(out)


def get_items(group):
    """
        Return list of items with info as dict

        Args:
            group:  wether to return portfolio or blog entries [portfolio/blog]
    """

    assert group in BLOCKS

    out = OrderedDict()

    for filename in reversed(sorted(os.listdir(PATH_CONTENT + group))):
        num, name = filename.split(NUM_SEPARATOR)

        # Strip extensions
        name = name.split(".")[0]

        out[name] = _read_yaml(f"{PATH_CONTENT}{group}/{num}-{name}.yaml")

    return _transform_markdown(out)


def get_content():
    """ Read all portfolio and blog items and split highlighted """

    out = {}

    for x in BLOCKS:
        out[x] = get_items(x)

        # Add highlited items as a new entry
        out[f"{x}_high"] = {i: data for i, data in out[x].items() if data.get("highlight", False)}

    # Projects that will be at the main page
    out["portfolio_main"] = {
        i: data for i, data in out["portfolio"].items() if data.get("main", False)
    }

    num_portfolio_main = len(out["portfolio_main"])

    # At home page there should be a multiple of 4 portfolio items (and at least 4 of them)
    assert (num_portfolio_main % 4 == 0) and (num_portfolio_main > 0)

    return out


def extract_tags(data):
    """ Retrives a sorted list of all tags presents """

    tags = [x for elem in data for x in elem.get("tags_filter", None)]
    return sorted(set(tags))
