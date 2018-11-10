""" Flask freezer """

import sys
import os # TODO: also temporal

from flask_frozen import Freezer
from index import APP

FREEZER = Freezer(APP)


if __name__ == '__main__':

    if (len(sys.argv) > 1) and ("preview" == sys.argv[1]):
        print("Running Flask-frozen preview mode")
        FREEZER.run(debug=True)

    else:
        FREEZER.freeze()
