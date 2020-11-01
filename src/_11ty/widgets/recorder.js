/* global exports */
exports.addWidgets = function (eleventyConfig) {
  eleventyConfig.addNunjucksShortcode('recorder', function ({
    hasVideo = true,
    time = 15,
  } = {}) {
    // prettier-ignore
    return /* html */ `
<div data-widget="recorder" x-data="CLIENT.recorder_data(${hasVideo}, ${time})" x-init="init()" class="video widget">
  <div class="recorderbuttons">
    <button type="button" id="recorderbutton" class="button"></button>
    <button type="button" id="recordersavebutton" class="hidden button">Save</button>
  </div>
  <a class="hidden" id="recordersaveanchor"></a>
  <video class='hidden' id="preview-video"></video>
  <audio controls class='hidden' id="preview-audio"></audio>
</div>
   `
  })
}
