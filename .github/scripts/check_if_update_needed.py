import click
from loguru import logger
from packaging import version
from utils import set_output


def check_versions_are_consecutive(version_current, version_main):
    diff_major = version_current.major - version_main.major
    diff_minor = version_current.minor - version_main.minor
    diff_micro = version_current.micro - version_main.micro

    if (diff_major > 1) or (diff_minor > 1) or (diff_micro > 1):
        return False

    if diff_major == 1:
        if (
            (diff_minor > 0)
            or (diff_micro > 0)
            or (version_current.minor != 0)
            or (version_current.micro != 0)
        ):
            return False

        return True
    else:
        if diff_minor == 1:
            if (diff_micro > 0) or (version_current.micro != 0):
                return False
            return True
    return True


def validate_versions(version_current, version_main):
    if not check_versions_are_consecutive(version_current, version_main):
        logger.error("Only one version increase at a time allowed")
        exit(1)

    logger.success("Versions are consecutive")


@click.command()
@click.option("--version_current")
@click.option("--version_main")
@click.option("--project", default="dbt", help="'dbt' or 'docker'")
def compare_versions(version_current, version_main, project):
    logger.info(f"Running with {version_current=}, {version_main=}")

    version_current = version.parse(version_current)
    version_main = version.parse(version_main)

    validate_versions(version_current, version_main)

    needs_update = version_current <= version_main

    logger.info(f"Outcome {needs_update}")

    set_output("NEEDS_UPDATE", str(needs_update).lower())


if __name__ == "__main__":
    compare_versions()
