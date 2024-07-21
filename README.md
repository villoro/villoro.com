# <img src="images/logo.png" alt="logo_villoro" width="90px"/> My Personal Webpage

[![Netlify Status](https://api.netlify.com/api/v1/badges/6f3b0fb4-f908-426f-b880-6629be37bc4b/deploy-status)](https://app.netlify.com/sites/villoro/deploys)
[![PageSpeed](https://img.shields.io/badge/PageSpeed-95%25-brightgreen.svg)](https://developers.google.com/speed/pagespeed/insights/?url=villoro.com)
[![powered by Astro](https://img.shields.io/badge/powered_by-Astro-orange.svg)](https://astro.build/)

This is the code for my personal webpage. You can view it live here: [villoro.com](https://villoro.com/).

## Overview
The webpage is built using [Astro](https://astro.build/), utilizing the [Astroplate](https://github.com/zeon-studio/astroplate) template. It is designed to be fast and responsive, providing a seamless experience across both computers and smartphones.

Some screenshots:

![home](images/mockup_1.jpg)
![about](images/mockup_2.jpg)

## Run/View the Web
To run the website locally, use the following commands:

1. Install dependencies:

    ```bash
    npm install
    ```

2. Start the development server:

    ```bash
    npm start
    ```

3. Build the static site for production:

    ```bash
    npm run build
    ```

## Project Structure
The project is organized as follows:

- **src/**: Contains the source code for the Astro components and pages.
- **public/**: Contains static assets like images and styles.
- **content/**: Contains markdown or data files for the site content.

### Main Components
- **layouts/**: Layout templates for different page types.
- **components/**: Reusable UI components.
- **pages/**: Main pages of the site.

## Deployment
The site is deployed using [Netlify](https://www.netlify.com/). You can trigger a deployment by pushing changes to the main branch. For feature development, create a feature branch, and merge it into the main branch through a pull request.

## Authors
* [Arnau Villoro](https://villoro.com)

## License
The content of this repository is licensed under the [MIT License](https://opensource.org/licenses/MIT).
