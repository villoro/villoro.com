""" Flask freezer """

from flask_frozen import Freezer
from index import APP

FREEZER = Freezer(APP)


if __name__ == "__main__":
    FREEZER.freeze()
