/* global Tone Tonal ABCJS YOUTUBE */

function html(strings, ...expressions) {
  return strings.reduce(
    (result, currentString, i) =>
      `${result}${currentString}${expressions[i] ? `${expressions[i]}` : ''}`,
    '',
  )
}

/* global exports */
exports.Widgets = [
  {
    name: 'metronome',
    shortcode(bpm = 100) {
      return html`
<span
  x-data="WIDGETS.metronome_client(${bpm})"
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
</span>
      `
    },
    client(bpm = 100) {

      return {
        bpm: bpm,
        checked: false,
        incr: 5,

        uncheckOthers(source) {
          document
            .querySelectorAll('.metronome input[type="checkbox"]:checked')
            .forEach((e) => {
              if (e !== source && source.checked) {
                e.click()
              }
            })
        },

        renderAudio() {
          if (!player) {
            player = new Tone.Player('/sounds/woodblock.wav').toMaster()
            Tone.Buffer.on('load', function () {
              Tone.Transport.scheduleRepeat(function (time) {
                player.start(time)
              }, '4n')
            })
          }

          Tone.Transport.bpm.value = this.bpm

          if (this.checked) {
            Tone.Transport.start()
          } else if (!this.checked) {
            Tone.Transport.stop()
          }
        },
      }
    },
  },
]

const clientFunctions = [
  {
    name: 'seekVideo',
    client(source, minsec = '00:00', videoNum = 0) {
      var a = minsec.split(':')
      if (a.length == 1) {
        a.unshift('0')
      }
      if (a.length == 1) {
        a.unshift('0')
      }
      0
      var seconds = +a[0] * 60 + +a[1]

      YOUTUBE.seekTo(seconds, videoNum)
    }
  },

  {
    name: 'replaceABCFences',
    private: true,
    client() {
      const abcNodes = document.querySelectorAll('code.language-abc')
      for (const node of abcNodes) {
        const abc = node.textContent
        const div = document.createElement('div')
        ABCJS.renderAbc(div, abc, { visualTranspose: -24, responsive: 'resize' })
        node.parentElement.appendChild(div)
        node.style.display = 'none'
      }
    }
  },

  {
    name: 'getRandomInt',
    private: true,
    client(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      const rnd = Math.floor(Math.random() * (max - min)) + min
      return rnd
    }
  },

  {
    name: 'allNotes',
    private: true,
    client() {
      const notes = Tonal.Range.chromatic(['C2', 'B2']).flatMap((n) => {
      const bare = Tonal.Note.get(n).pc // drop octave
      const enh = Tonal.Note.enharmonic(bare)
      return enh != bare ? [enh, bare] : bare
    })
    return notes
  }},

  {
    name: 'pickRandom',
    private: true,
    client(items) {
      let lastIndex
      return function () {
        let index
        do {
          index = getRandomInt(0, items.length)
        } while (index === lastIndex)
        lastIndex = index
        return items[index]
      }
   }},

  {
    name: 'renderRandomNote',
    client(source /*, constraint*/) {
      if (!source.genFunc) {
        source.genFunc = pickRandom(allNotes())
      }
      const span = source.querySelector('span')
      span.innerText = source.genFunc()
  }},

  {
    name: 'init',
    client() {
      document.addEventListener('DOMContentLoaded', replaceABCFences)
  }}
]


/* global require */
const fs = require('fs')

exports.createClientJavaScriptFile = function (file) {
  const globals= ["let player"]
  const widgetFuncs = exports.Widgets.map((w) => `  function ${w.name}_${w.client.toString()}`)
  const otherFuncs = clientFunctions.map((f) => `  function ${f.name}${f.client.toString().replace('client','')}`)
  const allFuncs = [...widgetFuncs, ...otherFuncs]
  const widgetExports = exports.Widgets.map((w) => `    ${w.name}_client:${w.name}_client`)
  const otherExports = clientFunctions.filter((f)=>!f.private).map((f) => `    ${f.name}:${f.name}`)
  const allExports = [...widgetExports, ...otherExports]

  const code = `
const WIDGETS = (function () {
  'use strict'\n
${globals.join('\n\n')}\n
${allFuncs.join('\n\n')}\n
  return {
${allExports.join(',\n')}
  }
})()

WIDGETS.init()
  `

  fs.writeFile(file, code, (err) => {
    if (err) throw err
  })
}
