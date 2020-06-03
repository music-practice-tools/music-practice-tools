/* global require module */
const { DateTime } = require('luxon')
const fs = require('fs')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItTaskLists = require('markdown-it-task-lists')
const markdownItBlockEmbedd = require('markdown-it-block-embed')
const pluginNavigation = require('@11ty/eleventy-navigation')
// markdown-it-collapsible
// markdown-it-video

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginNavigation)

  eleventyConfig.setDataDeepMerge(true)

  eleventyConfig.addLayoutAlias('activity', 'activity.html.njk')

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy')
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd')
  })

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n)
    }

    return array.slice(0, n)
  })

  eleventyConfig.addCollection('tagList', require('./src/_11ty/getTagList'))

  eleventyConfig.addPassthroughCopy({ 'src/img': 'img' })
  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' })
  eleventyConfig.addPassthroughCopy({ 'src/favicons/': '' })
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' })

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  })
    .use(markdownItAnchor, {
      permalink: true,
      permalinkClass: 'direct-link',
      permalinkSymbol: '#', //&#128279;
      permalinkBefore: false,
    })
    .use(markdownItTaskLists, { enabled: true })
    .use(markdownItBlockEmbedd, {
      outputPlayerSize: false,
      containerClassName: 'video-embed',
    })
  eleventyConfig.setLibrary('md', markdownLibrary)

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
      },
    },
    ui: false,
    ghostMode: false,
  })

  return {
    templateFormats: ['md', 'njk', 'html', 'liquid'],

    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    // These are all optional, defaults are shown:
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
      output: '_site',
    },
  }
}
