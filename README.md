# music-practice-tools

[![Netlify Status](https://api.netlify.com/api/v1/badges/c2677289-ece4-4fd0-97a0-aa0c1ca166e2/deploy-status)](https://app.netlify.com/sites/music-practice-tools/deploys)

Tools to help with practicing and improving musicality, especially with remote lessons.

The concept is a blog / journal which contains interactive elements for making life easier. These include:

- Metronomes with predefined yet adjusable bpm
- [quasi]Random note and number selectors (all items in a range are presented)
- Activity timer with elapsed and total times that persists between pages and sessions
- You Tube Video timer that's always visible regardless of scrolling
- Video seek buttons
- Music scoring using the abc notation. Provides interactive playing features

Uses [this stack](https://musicpracticetools.net/about/) of awesome opensource technology.

Pages are authored using nunjucks teplates rendered by the 11ty static site generator.

## Developers

This use a typical nodejs development platform so:

- clone the repo
- `npm install`
- `npm run devall`
- browse to the localhost URL printed on the cli.

I publish via Netlify which makes it trivial to do.

### Notes

It's basically a static site using nunjucks templates with a little client-side javascript added behviours for interactive widgets. 11ty supports a range of templates and provides a few light utilites and abstractions. the widgets. This project is based on the 11ty blog example which supports tags.

Template short codes are used for the custom interactive widgets. These provide a very clean authoring experience but does mean some widget code is server side and some client side. In general the source code under `src` is:

- Page templates in `pages`
- 11ty config in `_11ty\*`
- Templates partials and layout in `_includes` and `_layouts`
- Server side widget code (HTML + Alpinejs) is in `_11ty\add-shortcodes.js`
- Client side code including widgets (Javascript and Alpinejs) is in `js\*`
- Client side CSS is in `css\*`

Client code assumes an up to date browser using ES6 features to improve DX.

When running `npm run dev` 11ty generates the website from `src` into `_site` which is then served. Changes to client-side files cause a rebuild of the site and browsersync forces an browser refresh.
However, when serverside files in `_11ty` change the site must be regenrated. `npm run devall` forces a rebuild in this case but then the browser does not refresh.
Pressing F5 to refesh the browser is required in this case.

I develop on Windows using VS Code. In theory Linux and Mac dev platforms should just work.
