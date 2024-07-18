import os
from PIL import Image
from loguru import logger
import click


IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".bmp", ".gif", ".ico")


def parse_aspect_ratio(aspect_ratio_str):
    width, height = map(int, aspect_ratio_str.split(":"))
    return width / height


def check_aspect_ratio(directory, target_aspect_ratio_str):
    target_aspect_ratio = parse_aspect_ratio(target_aspect_ratio_str)

    failures = 0
    for filename in os.listdir(directory):
        if not filename.lower().endswith(IMAGE_EXTENSIONS):
            continue

        with Image.open(os.path.join(directory, filename)) as img:
            width, height = img.size

        aspect_ratio = width / height
        if not (aspect_ratio == target_aspect_ratio):
            logger.warning(
                f"{filename} has an aspect ratio of {aspect_ratio:.2f}, "
                f"which is not {target_aspect_ratio_str}"
            )
            failures += 1
        else:
            logger.info(f"{filename} has a {target_aspect_ratio_str} aspect ratio")

    return failures


@click.command()
@click.option("--directory", required=True, help="Directory containing the images")
@click.option(
    "--aspect-ratio",
    required=True,
    help='Target aspect ratio to validate against (e.g., "16:9" or "1:1")',
)
def validate_images(directory, aspect_ratio):
    failures = check_aspect_ratio(directory, aspect_ratio)
    if failures == 0:
        logger.success(f"All images have the target aspect ratio")
        exit(0)

    logger.error(f"There are {failures} images that don't have the the {aspect_ratio=}")
    exit(1)


if __name__ == "__main__":
    validate_images()
