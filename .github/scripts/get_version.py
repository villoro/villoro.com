import click
from loguru import logger as log

from utils import set_output, get_version_from_json


@click.command()
@click.option("--name")
def export_version(name):
    version = get_version_from_json()
    set_output(f"VERSION_{name.upper()}", version)


if __name__ == "__main__":
    export_version()
