/* global exports */
exports.addWidgets = function (eleventyConfig) {
  eleventyConfig.addNunjucksShortcode('metronome', function ({
    bpm = 100,
    min = 20,
    max = 250,
    step = 5,
    pid = undefined,
  } = {}) {
    // prettier-ignore
    return /* html */ `
<span data-widget="metronome"
  x-data="CLIENT.metronome_data(${bpm}, ${min}, ${max}, ${step}, '${pid}')"
  class="metronome widget"
  x-on:click="onClick($el, $event, $dispatch)"
  x-on:metronome-start.window="onStart"
  x-on:stop-sounds.window="onStop">
  <button><</button>
  <label>
    <span x-text="\`\${bpm} bpm\`"></span>
    <input type="checkbox" x-model="checked" x-ref="cb" />
  </label>
  <button>></button>
</span>`
  })
}
