function parseSwing(swing) {
  return swing == 'hard' ? 3 : swing == 'medium' ? 2 : swing == 'soft' ? 1 : 0
}

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
      swing = 'straight',
    } = {},
  ) {
    // prettier-ignore
    return /* html */ `
<div data-widget="abc" data-swing="${parseSwing(swing)}">
<label class="abc-src" onclick="CLIENT.toggleABCSource(this)">
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
</div>
`
  })
}
