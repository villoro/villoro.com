import os
from PIL import Image
from loguru import logger
import click


def parse_aspect_ratio(aspect_ratio_str):
    width, height = map(int, aspect_ratio_str.split(":"))
    return width / height


def check_aspect_ratio(directory, target_aspect_ratio_str):
    target_aspect_ratio = parse_aspect_ratio(target_aspect_ratio_str)

    all_good = True
    for filename in os.listdir(directory):
        if not filename.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".gif")):
            continue

        with Image.open(os.path.join(directory, filename)) as img:
            width, height = img.size

        aspect_ratio = width / height
        if not (aspect_ratio == target_aspect_ratio):
            logger.warning(
                f"{filename} has an aspect ratio of {aspect_ratio:.2f}, which is not {target_aspect_ratio_str}."
            )
            all_good = False
        else:
            logger.info(f"{filename} has a {target_aspect_ratio_str} aspect ratio.")

    return all_good


@click.command()
@click.option("--directory", required=True, help="Directory containing the images.")
@click.option(
    "--aspect-ratio",
    required=True,
    help='Target aspect ratio to validate against (e.g., "16:9" or "1:1").',
)
def validate_images(directory, aspect_ratio_str):
    if check_aspect_ratio(directory, aspect_ratio_str):
        logger.success(f"All images have the target aspect ratio.")
        exit(0)

    logger.error(f"Some images do not have the target aspect ratio.")
    exit(1)


if __name__ == "__main__":
    validate_images()
