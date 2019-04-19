""" Flask freezer """

from shutil import copyfile

from flask_frozen import Freezer
from index import APP


FREEZER = Freezer(APP)


if __name__ == "__main__":
    FREEZER.freeze()

    # copy the _redirects file to the /build path
    copyfile("_redirects", "src/build/_redirects")
