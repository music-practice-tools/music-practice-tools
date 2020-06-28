// WARNING - changes to this file will require restarting the dev server
// as it is loaded from elventy.js

// return the string as entered. Only used so VS Code lit-html extension works
// without associated runtime error
// TODO find better way without runtime impact
function html(strings, ...expressions) {
  return strings.reduce(
    (result, currentString, i) =>
      `${result}${currentString}${
        expressions[i]
          ? expressions[i]
          : expressions[i] == ''
          ? `''`
          : expressions[i] === undefined
          ? ''
          : expressions[i]
      }`,
    '',
  )
}

/* global exports */
exports.addShortcodes = function (eleventyConfig) {
  eleventyConfig.addNunjucksShortcode('homeLink', function () {
    // prettier-ignore
    return `<a href="/">← Home</a>`
  })

  /* widgets */
  eleventyConfig.addNunjucksShortcode('randomNote', function ({
    text = 'Random Note',
    scale = 'all-enharmonic',
    pid,
  } = {}) {
    // prettier-ignore
    return html`
<button type="button" class="random-note widget"
  x-data="CLIENT.randomNote_data('${scale}', '${pid}')" x-on:click="getNextItem">
  ${text} <span x-text="\`\${value}\`"><span>
</button>`
  })

  /* widgets */
  eleventyConfig.addNunjucksShortcode('randomNumber', function ({
    text = 'Random Number',
    min = 1,
    max = 10,
    pid,
  } = {}) {
    // prettier-ignore
    return html`
<button type="button" class="random-number widget"
  x-data="CLIENT.randomNumber_data(${min}, ${max}, '${pid}')" x-on:click="getNextItem">
  ${text} <span x-text="\`\${value}\`"><span>
</button>`
  })

  eleventyConfig.addNunjucksShortcode('metronome', function ({
    bpm = 100,
    min = 30,
    max = 250,
    step = 5,
    pid,
  } = {}) {
    // prettier-ignore
    return html`
<span
  x-data="CLIENT.metronome_data(${bpm}, ${min}, ${max}, ${step}, '${pid}')"
  class="metronome widget"
  x-on:click="onClick($el, $event)">
  <button><</button>
  <label>
    <span x-text="\`\${bpm} bpm\`"></span>
    <input type="checkbox" x-model="checked" x-ref="cb" />
  </label>
  <button>></button>
</span>`
  })

  eleventyConfig.addNunjucksShortcode('seekVideo', function ({
    time,
    videoNum,
  } = {}) {
    // prettier-ignore
    return html`
  <button type="button" class="seek-video widget"
          onclick="CLIENT.seekVideo('${time}', ${videoNum})">
    ${time}
  </button>
   `
  })

  eleventyConfig.addNunjucksShortcode('timer', function ({
    time = 5,
    useURLTime = false,
    s = true,
    h = false,
    pid,
    tid,
  } = {}) {
    // prettier-ignore
    return html`
<div
  x-data="CLIENT.timer_data(${time}, ${useURLTime}, '${pid}', '${tid}')"
  x-init="init()"
  x-on:unload.window="persist"
  class="timer widget">
  <div style="display: flex; justify-content: space-around; width:100%">
    <button x-on:click="btnAction" x-text="\`\${btnText()}\`"></button>
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
    pid,
  ) {
    const items = content.split('\n- ')
    //items.filter((i) => i != '-'  && i != '')
    console.log(items, items.length)
    return `
<ul class="task-slist">
${content}
</ul>
`
  })

  const activityCheck = (classes, timerid) =>
    // prettier-ignore
    html`
  <input
    class="${classes}"
    type="checkbox"
    onclick="if (this.checked) {CLIENT.lapTimer('${timerid}')} else {return false}"/>
  `

  eleventyConfig.addNunjucksShortcode('activityCheck', function ({
    classes = '',
    timerid,
  } = {}) {
    return activityCheck(classes, timerid)
  })

  eleventyConfig.addNunjucksShortcode('dailyCheck', function () {
    // prettier-ignore
    return activityCheck('task-list-item-checkbox', 'main')
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
    } = {},
  ) {
    // prettier-ignore
    return `
<label class="abc-src" onclick="CLIENT.toggleABCSource(this.nextElementSibling.firstChild)">
  <span>Show ABC source</span>
  <input class="" type="checkbox" />
</label>

\`\`\`abc
X: 1
K: ${key} clef=bass transpose=-12
M: ${meter}
Q: ${tempo}
L: ${unitnotelength}
C: ${artist}
T: ${title}
R: ${rhythm}
[I: MIDI=program 33]
${content}
\`\`\`
`
  })
}
