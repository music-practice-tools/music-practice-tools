/* global exports */
exports.addWidgets = function (eleventyConfig) {
  eleventyConfig.addPairedNunjucksShortcode('activityList', function (
    content,
    { timerid = undefined, pid = undefined } = {},
  ) {
    // prettier-ignore
    return /* html */ `
<div data-widget="activityList"
  x-data="CLIENT.activityList_data($el, '${timerid}', '${pid}')"
  x-init="init()"
  x-on:unload.window="persist"
  x-on:click="childClick($event, $dispatch)"
  class="task-list">
<button class="toggle" x-show="hasTimer" x-text="toggleText()"></button>
<button class="reset">Clear</button>
${content}
<button class="done">Done</button>
</div>
    `
  })

  eleventyConfig.addNunjucksShortcode('activity', function ({
    classes = 'task-list-item-checkbox',
    time = 3,
  } = {}) {
    // NB indenting required to get correct font size
    // prettier-ignore
    return /* html */`
  <input data-widget="activity" data-time="${time}"
    class="${classes}"
    type="checkbox"
  />
`
  })
}
