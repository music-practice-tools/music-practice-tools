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
<template x-if="hasTimer">
  <button class="toggle" x-text="toggleText()"></button>
  <button class="stop">Clear</button>
  <button class="reset">Zero</button>
</template>
${content}
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
