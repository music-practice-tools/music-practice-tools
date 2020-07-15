/* global exports */
exports.addWidgets = function (eleventyConfig) {
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
