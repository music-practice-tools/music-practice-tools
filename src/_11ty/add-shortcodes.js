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

/* global module */
module.exports = function addShortcodes(eleventyConfig) {
  eleventyConfig.addShortcode('homeLink', function () {
    return `<a href="/">← Home</a>`
  })

  /* widgets */
  eleventyConfig.addShortcode('randomNote', function (text, constraint) {
    return html`<button type="button" class="random-note" onclick="renderRandomNote(this, '${text}', ${constraint})">
      ${text} <span>?<span>
    </button>`
  })

  eleventyConfig.addShortcode('metronome', function (bpm) {
    return html`<span class="metronome">[<label >${bpm} bpm
      <input type="checkbox" onclick="toggleMetronome(this, ${bpm})">
    </label>]</span>`
  })
}
