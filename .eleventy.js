/* global require module */
const fs = require('fs')
const pluginNavigation = require('@11ty/eleventy-navigation')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginNavigation)

  eleventyConfig.setDataDeepMerge(true)

  eleventyConfig.addLayoutAlias('activity', 'activity.html.njk')

  require('./src/_11ty/add-filters').addFilters(eleventyConfig)
  require('./src/_11ty/add-shortcodes').addShortcodes(eleventyConfig)
  require('./src/_11ty/add-collections').addCollections(eleventyConfig)
  require('./src/_11ty/configure-markdown').configureMarkdown(eleventyConfig)

  eleventyConfig.addPassthroughCopy({ 'src/img': 'img' })
  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' })
  eleventyConfig.addPassthroughCopy({ 'src/sounds': 'sounds' })
  eleventyConfig.addPassthroughCopy({ 'src/favicons/': '/' })
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' })

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html')

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404)
          res.end()
        })

        browserSync.publicInstance.reload()
      },
    },
    ui: false,
    ghostMode: false,
    browser: 'msedge',
  })

  return {
    templateFormats: ['md', 'njk', 'html'],

    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    // These are all optional, defaults are shown:
    dir: {
      input: 'pages',
      includes: '../src/_includes',
      layouts: '../src/_layouts',
      data: '../src/_data',
      output: '_site',
    },
  }
}
