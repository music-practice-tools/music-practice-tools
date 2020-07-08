/* global exports */

exports.passthroughCopy = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/img': 'img' })
  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' })
  eleventyConfig.addPassthroughCopy({ 'src/sounds': 'sounds' })
  eleventyConfig.addPassthroughCopy({ 'src/favicons/': '/' })
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' })
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' })
}
