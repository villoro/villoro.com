# <img src="images/logo.png" alt="logo_villoro" width="90px"/> My personal webpage

[![Netlify Status](https://api.netlify.com/api/v1/badges/6f3b0fb4-f908-426f-b880-6629be37bc4b/deploy-status)](https://app.netlify.com/sites/villoro/deploys)
[![PageSpeed](https://img.shields.io/badge/PageSpeed-95%25-brightgreen.svg)](https://developers.google.com/speed/pagespeed/insights/?url=villoro.com)
[![powered by Flask](https://img.shields.io/badge/powered_by-Frozen_Flask-blue.svg)](https://pythonhosted.org/Frozen-Flask/)

This is the code of my personal webpage. You can view it live here: [villoro.com](https://villoro.com/).

It is created to be very fast. You can check it with [pagespeed](https://developers.google.com/speed/pagespeed/insights/?hl=ca&url=villoro.com).

## Overview
It is a static webpage build with [flask](http://flask.pocoo.org/) that has been made static with [frozen flask](https://pythonhosted.org/Frozen-Flask/). It uses the power of [jinja2](http://jinja.pocoo.org/docs/2.10/) templates.

The webpage is responsive by design. It should be nicely displayed in both computers and smartphones. 

Some screenshoots:

![home](images/mockup_1.jpg)
![about](images/mockup_2.jpg)

## Run/view the web
You can run the flask app with the following command:

    python src/index.py
    
There is also a ```Procfile``` so that you can deploy the website directly to [heroku](https://heroku.com).

If you want to create the static web you will only need to execute:

    python src/freeze.py
    
## How it works
There are only 3 python files:
* **index.py:** flask app
* **freeze.py:** frozen flask script
* **utils.py:** file for reading some **yaml** files to create the web

And 3 folders:
* **static/** this is where images and **css** are stored.
* **templates/** folder with **html** templates of every page
* **content/** content of the web

So what the app will do is to read the **content** and create and **html** file using some **template** and some resources from **static**


### Static
This folder is quite simple, it contains **images** and **css** with some folder to keep everything organized.

### Templates
There is a ```base.html``` template that has the skeleton for the whole page. All pages inherit from this template.

Then there are the main pages:
* home
* about
* portfolio
* blog

Those main pages all have the same structure with some parallax effect. To do so they inherit from the ```page.html``` template. For example, to render the **home** page it will inherit following this structure:

    - base.html
        - page.html
            - home.html
            
Then there is ```portfolio_item.html``` which is the template used to render one item of the portfolio. It only inherits from ```base.html``` since there is no parallax effect.

### Content
This folder has some info about the web that is better to keep it appart form the **html** itself.

For example the tools I use are in a [yaml](https://en.wikipedia.org/wiki/YAML) file so that it will be easier to update. This way it will also allow to use iterations with jinja2 and avoid repeated html in the templates.

There are also the **portfolio** and **blog** folders which have some other **yaml** files with one portfolio item or blog post. The idea is that flask will know what they are since it can found the items in the appropiate folder.

This items have some metadata like:
* code
* title
* image

And also some content (like **brief** or **results**). By default the content is written with markdown and flask will transform it to html.

It is also important to notice that content in one of those folders is ordered with the number in the name. So all entries should be named with the following structure ```NN-my_post.yml``` where NN is a number.

## Authors
* [Arnau Villoro](villoro.com)

## License
The content of this repository is licensed under a [MIT](https://opensource.org/licenses/MIT).

## Nomenclature
Branches and commits use some prefixes to keep everything better organized.

### Branches
* **f/:** features
* **r/:** releases
* **h/:** hotfixs

### Commits
* **[NEW]** new features
* **[FIX]** fixes
* **[REF]** refactors
* **[PYL]** [pylint](https://www.pylint.org/) improvements
* **[TST]** tests
