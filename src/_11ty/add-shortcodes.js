// WARNING - changes to this file will require restarting the dev server
// as it is loaded from elventy.js

// return the string as entered. Only used so VS Code lit-html extension works
// without associated runtime error
// TODO find better way without runtime impact
function html(strings, ...expressions) {
  return strings.reduce(
    (result, currentString, i) =>
      `${result}${currentString}${expressions[i] ? `${expressions[i]}` : ''}`,
    '',
  )
}

/* global exports */
exports.addShortcodes = function (eleventyConfig) {
  eleventyConfig.addShortcode('homeLink', function () {
    // prettier-ignore
    return `<a href="/">← Home</a>`
  })

  /* widgets */
  eleventyConfig.addShortcode('randomNote', function (
    text = 'Random Note',
    scale = 'chromatic-enharmonic',
  ) {
    // prettier-ignore
    return html`
<button type="button" class="random-note widget"
  x-data="FUNCTIONS.randomNote_data('${scale}')" x-on:click="getNote">
  ${text} <span x-text="\`\${note}\`"><span>
</button>`
  })

  eleventyConfig.addShortcode('metronome', function (bpm = 100) {
    // prettier-ignore
    return html`
<span
  x-data="FUNCTIONS.metronome_data(${bpm})"
  x-init="$watch('checked', () => {renderAudio()}), $watch('bpm', () => {renderAudio()}) "
  class="metronome widget">
  <button x-on:click="bpm -= incr"><</button>
  <label>
    <span x-text="\`\${bpm} bpm\`"></span>
    <input
      type="checkbox"
      x-model="checked"
      x-on:click="(uncheckOthers($event.target))"
    />
  </label>
  <button x-on:click="bpm += incr">></button>
</span>`
  })

  eleventyConfig.addShortcode('seekVideo', function (time, videoNum) {
    // prettier-ignore
    return html`
<button
  type="button"
  class="seek-video widget"
  onclick="FUNCTIONS.seekVideo(this, '${time}', '${videoNum}')">
  ${time}
</button>`
  })

  eleventyConfig.addPairedNunjucksShortcode('abc', function (
    content = '',
    title = '',
    artist = '',
    key = 'c',
    meter = '4/4',
    tempo = '4/4=100',
    rhythm = '',
    unitnotelength = '1/8',
  ) {
    // prettier-ignore
    return `
\`\`\`abc
X: 1
K: ${key} bass
M: ${meter}
Q: ${tempo}
L: ${unitnotelength}
C: ${artist}
T: ${title}
R: ${rhythm}
${content}
\`\`\`
`
  })
}
