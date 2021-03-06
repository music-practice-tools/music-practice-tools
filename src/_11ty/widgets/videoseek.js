/* global exports */

function videoList(content = '', vid, noLoop = false, title = '') {
  // prettier-ignore
  return /* html */ `
<div data-widget="videoSeekList" data-vid="${vid}"
  x-data="CLIENT.videoSeekList_data($el, ${noLoop})"
  x-init="init($dispatch)"
  x-on:click="childEvent"
  x-on:change="childEvent">
  <div class="video-title">${title}</div>
  <button class="toggle" x-text="toggleText()"></button>
  <label x-show="!noLoop">
    Loop Section
    <input type="checkbox" x-model="looping"/>
  </label>
  <label>
    Show Video
    <input type="checkbox" x-model="showVideo"/>
  </label>
  <label>
    Speed
    <select class="speed">
      <option value="0.25">0.25</option>
      <option value="0.5">0.5</option>
      <option value="0.75">0.75</option>
      <option value="1" selected>Normal</option>
    </select>
  </label>
${content}
<div x-show="showVideo">

@[youtube](${vid})

</div>
</div>
   `
}

exports.addWidgets = function (eleventyConfig) {
  eleventyConfig.addPairedNunjucksShortcode('videoSeekList', function (
    content,
    { vid = '', title = '' } = {},
  ) {
    return videoList(content, vid, false, title)
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

  eleventyConfig.addNunjucksShortcode('video', function ({
    vid = '',
    title = '',
  } = {}) {
    return videoList('', vid, false, title)
  })
}
