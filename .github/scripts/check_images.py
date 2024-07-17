import os
from PIL import Image
from loguru import logger


def check_aspect_ratio(directory):
    all_good = True
    for filename in os.listdir(directory):
        if not filename.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".gif")):
            continue

        with Image.open(os.path.join(directory, filename)) as img:
            width, height = img.size

        aspect_ratio = width / height
        if not (aspect_ratio == 16 / 9):
            logger.warning(f"{filename} has {aspect_ratio=}, which is not 16:9.")
            all_good = False

        else:
            logger.info(f"{filename} has a 16:9 aspect ratio.")

    return all_good


if __name__ == "__main__":
    import sys

    directory = sys.argv[1]
    if check_aspect_ratio(directory):
        logger.success("All images have a 16:9 aspect ratio.")
        exit(0)

    logger.critical("Some images do not have a 16:9 aspect ratio.")
    exit(1)
