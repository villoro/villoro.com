import os

import json
from loguru import logger

PACKAGE_JSON = "package.json"


def set_output(name, value):
    logger.info(f"Setting {name=} {value=}")
    with open(os.environ["GITHUB_ENV"], "a") as fh:
        print(f"{name}={value}", file=fh)


def get_version_from_json():
    logger.info("Retrieving package version")

    with open(PACKAGE_JSON) as stream:
        version = json.load(stream)["version"]

    logger.info(f"{version=} retrieved")
    return version
