# music-practice-tools

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)[![Netlify Status](https://api.netlify.com/api/v1/badges/c2677289-ece4-4fd0-97a0-aa0c1ca166e2/deploy-status)](https://app.netlify.com/sites/music-practice-tools/deploys)

Tools to help with music practice and improving musicality as well as remote lessons.

The format is a blog / journal which contains interactive elements for making life easier.
These include:

- Metronomes with predefined yet adjusable bpm
- [quasi]Random note and number selectors (all items in a range are presented)
- Activity timer with elapsed and total times that persist between pages and sessions
- You Tube Video timer that's always visible regardless of scrolling
- Video seek buttons
- Music scoring using the abc notation. Provides interactive playing features

Uses [this stack](https://musicpracticetools.net/about/) of awesome opensource technology.

All pages live in the [`pages`](https://github.com/music-practice-tools/music-practice-tools/tree/master/pages) folder and are authored using nunjucks templated markdown which are rendered by the awesome 11ty static site generator. Widgets are added with shortcodes.

This use a typical nodejs development platform so:

- clone the repo
- `npm install`
- `npm run devall`
- edit pages
- browse to the localhost URL printed on the cli (usually `http://localhost:8080/`).

---

Get your own version of https://musicpracticetools.net/ on the web with Netlify using this button.
It will clone this repo to your own GitHub account and link it to a new site for you on Netlfy.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/music-practice-tools/music-practice-tools)

---

## Developers

The non pages source code is in the [`src`](https://github.com/music-practice-tools/music-practice-tools/tree/master/src). The usual dev tool config files are in the project root.

### Notes

This is basically a static site using nunjucks templates with a little client-side javascript added for behaviours to provide interactive widgets. This project is based on the 11ty blog example which supports tags.

Template shortcodes are used for the custom interactive widgets. These provide a clean authoring experience but does mean some widget code is server side and some client side. In general the source code under `src` is:

- Page templates in `pages`
- 11ty config in `_11ty\*`
- Templates partials and layout in `_includes` and `_layouts`
- Server side widget code (HTML + Alpinejs) is in `_11ty\add-shortcodes.js`
- Client side code including widgets (Javascript and Alpinejs) is in `js\*`
- Client side CSS is in `css\*`

The client code assumes an up to date browser using ES6 features to improve DX.

When running `npm run dev` 11ty generates the website from `src` into `_site` which is then served. Changes to client-side files cause a rebuild of the site and browsersync forces an browser refresh.
However, when serverside files in `_11ty` change the site must be regenrated. `npm run devall` forces a rebuild in this case but then the browser does not refresh.
Pressing F5 to refesh the browser is required in this case.

I develop on Windows using VS Code. In theory Linux and Mac dev platforms should just work.
