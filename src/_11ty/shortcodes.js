/* global exports */
exports.addShortcodes = function (eleventyConfig) {
  eleventyConfig.addNunjucksShortcode('homeLink', function () {
    // prettier-ignore
    return /* html */ `<a data-widget="homeLink" href="/">← Home</a>`
  })

  /* widgets */
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

  /* widgets */
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

  eleventyConfig.addNunjucksShortcode('resetSettings', function ({
    text = 'Reset Settings',
  } = {}) {
    // prettier-ignore
    return /* html */ `
<button data-widget="resetSettings" type="button" class="widget"
  onclick="if (confirm('Do you want to reset all settings?')) {localStorage.clear()}">
  ${text}
</button>`
  })

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

  eleventyConfig.addPairedNunjucksShortcode('videoSeekList', function (
    content,
    { videoNum = 0 } = {},
  ) {
    // prettier-ignore
    return /* html */ `
<div data-widget="videoSeekList"
  x-data="CLIENT.videoSeekList_data($el, ${videoNum})"
  x-init="init()"
  x-on:click="childClick">
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

  eleventyConfig.addNunjucksShortcode('videoRecorder', function ({
    time = 15,
  } = {}) {
    // prettier-ignore
    return /* html */ `
<div data-widget="videoRecorder" x-data="CLIENT.recorder_data(${time})" x-init="init()" class="video widget">
  <button type="button" id="recorderbutton" class="button"></button>
  <video id="preview"></video>
</div>
   `
  })

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
  } = {}) {
    // NB indenting required to get correct font size
    // prettier-ignore
    return /* html */`
  <input data-widget="activity"
    class="${classes}"
    type="checkbox"
  />
`
  })

  eleventyConfig.addPairedNunjucksShortcode('abc', function (
    content,
    {
      title = '',
      artist = '',
      key = 'c',
      meter = '4/4',
      tempo = '4/4=100',
      rhythm = '',
      unitnotelength = '1/8',
      midiprogram = '33',
    } = {},
  ) {
    // prettier-ignore
    return /* html */ `
<label data-widget="abc" class="abc-src" onclick="CLIENT.toggleABCSource(this)">
  <span>Show ABC source</span>
  <input class="" type="checkbox" />
</label>

\`\`\`abc
X: 1
M: ${meter}
Q: ${tempo}
L: ${unitnotelength}
C: ${artist}
T: ${title}
R: ${rhythm}
%%MIDI program ${midiprogram}
K: ${key} clef=bass transpose=-12
${content}
\`\`\`
`
  })
}
