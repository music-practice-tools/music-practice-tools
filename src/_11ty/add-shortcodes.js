// return the string as entered. Only used so VS Code lit-html extension works
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

  eleventyConfig.addShortcode('scripts', function () {
    return html`<script>
      var player
      const toggleMetronome = (source, bpm) => {
        const start = source.checked

        if (!player) {
         player = new Tone.Player("/sounds/woodblock.wav").toMaster();
         //player.volume.value = -6;

          Tone.Buffer.on('load', function() {
            Tone.Transport.scheduleRepeat(function(time){
              player.start(time)
            }, "4n")
          })
        }

      if (start) {
          const others = document.querySelectorAll('.metronome input[type="checkbox"]:checked')
          others.forEach( e => {if (e != source) { e.checked = false}})
          Tone.Transport.bpm.value = bpm
          Tone.Transport.start()
        }
        else {
          Tone.Transport.stop()
        }
      }
      </script>`
  })

  eleventyConfig.addShortcode('metronome', function (bpm) {
    return html`<span class='metronome'>[<label >${bpm} bpm
      <input type="checkbox" onclick="toggleMetronome(this, ${bpm})">
    </label>]</span>`
  })
}
