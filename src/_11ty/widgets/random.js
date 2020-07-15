/* global exports */
exports.addWidgets = function (eleventyConfig) {
  eleventyConfig.addNunjucksShortcode('randomNote', function ({
    text = 'Random Note',
    scale = 'circleoffourths',
    pid = undefined,
  } = {}) {
    // prettier-ignore
    return /* html */ `
<button data-widget="randomNote" type="button" class="random-note widget"
  x-data="CLIENT.randomNote_data('${scale}', '${pid}')" x-on:click="getNextItem">
  ${text} <span x-text="\`\${value}\`"><span>
</button>`
  })

  eleventyConfig.addNunjucksShortcode('randomNumber', function ({
    text = 'Random Number',
    min = 1,
    max = 10,
    pid = undefined,
  } = {}) {
    // prettier-ignore
    return /* html */ `
<button data-widget="randomNumber" type="button" class="random-number widget"
  x-data="CLIENT.randomNumber_data(${min}, ${max}, '${pid}')" x-on:click="getNextItem">
  ${text} <span x-text="\`\${value}\`"><span>
</button>`
  })
}
