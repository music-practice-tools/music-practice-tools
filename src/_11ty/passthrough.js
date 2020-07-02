/* global exports */

exports.passthroughCopy = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/img': 'img' })
  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' })
  eleventyConfig.addPassthroughCopy({ 'src/sounds': 'sounds' })
  eleventyConfig.addPassthroughCopy({ 'src/favicons/': '/' })
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' })
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' })

  eleventyConfig.addPassthroughCopy({
    'node_modules/@tonaljs/tonal/browser/tonal.min.js':
      'js/vendor/tonal.min.js',
  })
  eleventyConfig.addPassthroughCopy({
    'node_modules/tone/build/Tone.js': 'js/vendor/Tone.js',
  })
  eleventyConfig.addPassthroughCopy({
    'node_modules/alpinejs/dist/alpine.js': 'js/vendor/alpine.js',
  })
  // Note currently abcjs is missing the build folder contents so I copied to src/js/vendor.
  //eleventyConfig.addPassthroughCopy({
  //  'node_modules/abcjs/dist/abcjs_basic_6.0.0-beta.12-min.js':
  //    'js/vendor/abcjs_basic_6.0.0-beta.12-min.js',
  //})
}
