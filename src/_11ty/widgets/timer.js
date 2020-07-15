/* global exports */
exports.addWidgets = function (eleventyConfig) {
  eleventyConfig.addNunjucksShortcode('timer', function ({
    time = 5,
    useURLTime = false,
    s = true,
    h = false,
    pid = undefined,
    timerid = undefined,
    controls = 'true',
  } = {}) {
    // prettier-ignore
    return /* html */ `
<div data-widget="timer"
  x-data="CLIENT.timer_data(${time}, ${useURLTime}, '${pid}', '${timerid}')"
  x-init="init()"
  x-on:unload.window="persist"
  class="timer widget">
  <div x-show="${controls.toString()}" style="display: flex; justify-content: space-around; width:100%">
    <button x-on:click="toggle" x-text="\`\${btnText()}\`"></button>
    <button x-on:click="lap">Lap</button>
    <button x-on:click="reset">Rst</button>
  </div>
  <div style="display: flex; justify-content: space-between; width:100%">
    <span
      class="time"
      x-text="\`\${format(time, ${h.toString()}, true)}\`">
    </span>
    <span
      class="total"
      x-text="\`\${format(total, true, ${s.toString()})}\`">
    </span>
  </div>
  <span
    class="elapsed"
    x-bind:class="{ 'expired': isExpired() }"
    x-text="\`\${format(elapsed, ${h.toString()}, ${s.toString()})}\`">
  </span>
</div>
    `
  })
}
