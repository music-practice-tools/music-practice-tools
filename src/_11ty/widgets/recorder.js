/* global exports */
exports.addWidgets = function (eleventyConfig) {
  eleventyConfig.addNunjucksShortcode('videoRecorder', function ({
    time = 15,
  } = {}) {
    // prettier-ignore
    return /* html */ `
<div data-widget="videoRecorder" x-data="CLIENT.recorder_data(${time})" x-init="init()" class="video widget">
  <button type="button" id="recorderbutton" class="button"></button>
  <button type="button" id="recordersavebutton" class="hidden button">Save</button>
  <a class="hidden" download="mpt-video.webm"></a>
  <video id="preview"></video>
</div>
   `
  })
}
