/* global exports require */
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItTaskLists = require('markdown-it-task-lists')
const markdownItBlockEmbedd = require('markdown-it-block-embed')

exports.configureMarkdown = function (eleventyConfig) {
  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: false,
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
}
