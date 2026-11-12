import os
from PIL import Image
from loguru import logger
import click


IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".bmp", ".gif", ".ico")


def parse_aspect_ratio(aspect_ratio_str):
    width, height = map(int, aspect_ratio_str.split(":"))
    return width / height


def check_aspect_ratio(directory, target_aspect_ratio_str, max_kb=None):
    target_aspect_ratio = parse_aspect_ratio(target_aspect_ratio_str)

    failures = 0
    for filename in os.listdir(directory):
        if not filename.lower().endswith(IMAGE_EXTENSIONS):
            continue

        path = os.path.join(directory, filename)
        with Image.open(path) as img:
            width, height = img.size

        size_kb = os.path.getsize(path) / 1024
        if max_kb is not None and size_kb > max_kb:
            logger.warning(f"{filename} weighs {size_kb:.0f} KB, over the {max_kb} KB limit")
            failures += 1

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
@click.option("--max-kb", type=int, default=None, help="Maximum file size in KB (optional)")
def validate_images(directory, aspect_ratio, max_kb):
    failures = check_aspect_ratio(directory, aspect_ratio, max_kb)
    if failures == 0:
        logger.success("All images have the target aspect ratio and size")
        exit(0)

    logger.error(f"There are {failures} failures ({aspect_ratio=}, {max_kb=})")
    exit(1)


if __name__ == "__main__":
    validate_images()
