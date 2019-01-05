""" Flask freezer """

import sys

from flask_frozen import Freezer
from index import APP

FREEZER = Freezer(APP)


if __name__ == '__main__':

    if (len(sys.argv) > 1) and (sys.argv[1] == "preview"):
        print("Running Flask-frozen preview mode")
        FREEZER.run(debug=True)

    else:
        FREEZER.freeze()
