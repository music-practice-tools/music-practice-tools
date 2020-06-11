// WARNING - changes to this file will require restarting the dev server
// as it is loaded from elventy.js

// return the string as entered. Only used so VS Code lit-html extension works
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
  /* global require */
  const widgets = require('./ewidgets.js')
  widgets.createClientJavaScriptFile('src/js/widgets.js')

  eleventyConfig.addShortcode('homeLink', function () {
    return `<a href="/">← Home</a>`
  })

  /* widgets */
  eleventyConfig.addShortcode('randomNote', function (
    text = 'Random Note',
    scale = 'chromatic-enharmonic',
  ) {
    return html`
<button type="button" class="random-note widget" onanimationend="WIDGETS.renderRandomNote(this, '${scale}')" onclick="WIDGETS.renderRandomNote(this, '${scale}')">
  ${text} <span>?<span>
</button>`
  })

  widgets.Widgets.forEach((w) => {
    console.log(w)
    eleventyConfig.addShortcode(w.name, w.shortcode)
  })

  eleventyConfig.addShortcode('seekVideo', function (time, videoNum) {
    return html` <button
      type="button"
      class="seek-video widget"
      onclick="WIDGETS.seekVideo(this, '${time}', '${videoNum}')"
    >
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
