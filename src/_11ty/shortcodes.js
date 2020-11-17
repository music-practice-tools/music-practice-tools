/* global exports require */
exports.addShortcodes = function (eleventyConfig) {
  eleventyConfig.addNunjucksShortcode('homeLink', function () {
    // prettier-ignore
    return /* html */ `<a data-widget="homeLink" href="/">← Home</a>`
  })

  eleventyConfig.addNunjucksShortcode('resetSettings', function ({
    text = 'Reset Settings',
  } = {}) {
    // prettier-ignore
    return /* html */ `
<button data-widget="resetSettings" type="button" class="widget"
  onclick="if (confirm('Do you want to reset all settings?')) {localStorage.clear()}">
  ${text}
</button>`
  })

  require('./widgets/abc').addWidgets(eleventyConfig)
  require('./widgets/activitylist').addWidgets(eleventyConfig)
  require('./widgets/metronome').addWidgets(eleventyConfig)
  require('./widgets/counter').addWidgets(eleventyConfig)
  require('./widgets/random').addWidgets(eleventyConfig)
  require('./widgets/recorder').addWidgets(eleventyConfig)
  require('./widgets/timer').addWidgets(eleventyConfig)
  require('./widgets/videoseek').addWidgets(eleventyConfig)
}
