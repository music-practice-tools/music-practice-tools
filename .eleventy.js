/* global require module */
const pluginNavigation = require('@11ty/eleventy-navigation')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginNavigation)

  eleventyConfig.setDataDeepMerge(true)

  eleventyConfig.addLayoutAlias('activity', 'activity.html.njk')

  require('./src/_11ty/filters').addFilters(eleventyConfig)
  require('./src/_11ty/shortcodes').addShortcodes(eleventyConfig)
  require('./src/_11ty/collections').addCollections(eleventyConfig)
  require('./src/_11ty/markdown').configureMarkdown(eleventyConfig)
  require('./src/_11ty/passthrough').passthroughCopy(eleventyConfig)

  return {
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    dir: {
      input: 'pages',
      includes: '../src/_includes',
      layouts: '../src/_layouts',
      data: '../src/_data',
      output: '_site',
    },
  }
}
