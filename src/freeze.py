""" Flask freezer """

import sys
import os # TODO: also temporal

from flask_frozen import Freezer
from index import APP

FREEZER = Freezer(APP)

# TODO: this is temporal
# Generate portfolio pages
@FREEZER.register_generator
def portfolio_items():
    for name in os.listdir("src/portfolio"):
        yield '/portfolio-items/{}.html'.format(name.split(".")[0])


if __name__ == '__main__':

    if "preview" == sys.argv[1]:
        print("Running Flask-frozen preview mode")
        FREEZER.run(debug=True)

    else:
        FREEZER.freeze()
