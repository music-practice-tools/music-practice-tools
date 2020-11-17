/* global exports */
exports.addWidgets = function (eleventyConfig) {
  eleventyConfig.addNunjucksShortcode('counter', function ({
    count = 0,
    min = 0,
    max = 1000,
    step = 1,
    pid = undefined,
  } = {}) {
    // prettier-ignore
    return /* html */ `
<span data-widget="counter"
  x-data="CLIENT.counter_data(${count}, ${min}, ${max}, ${step}, '${pid}')"
  class="counter widget"
  x-on:click="onClick($el, $event)">
  <button>-</button>
    <span x-text="\`\${count}\`"></span>
  <button>+</button>
</span>`
  })
}
