/* global exports */
exports.addWidgets = function (eleventyConfig) {
  eleventyConfig.addPairedNunjucksShortcode('videoSeekList', function (
    content,
    { videoNum = 0 } = {},
  ) {
    // prettier-ignore
    return /* html */ `
<div data-widget="videoSeekList"
  x-data="CLIENT.videoSeekList_data($el)"
  x-init="init($dispatch)"
  x-on:click="childClick">
  <button class="toggle" x-text="toggleText()"></button>
  <label>
    Loop Section
    <input type="checkbox" x-model="looping"/>
  </label>
${content}
</div>
   `
  })

  eleventyConfig.addNunjucksShortcode('seekVideo', function ({
    time = '00:00',
  } = {}) {
    const a = time.split(':')
    if (a.length == 1) {
      a.unshift('0')
    }
    const seconds = (+a[0] * 60 + +a[1]).toString()
    // prettier-ignore
    return /* html */ `
  <button data-widget="seekVideo" data-seconds="${seconds}" type="button" class="seek-video widget">
    ${time}
  </button>
   `
  })
}
