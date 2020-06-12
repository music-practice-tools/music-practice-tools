// Note this cannot be a module as would be defered, breaking refs in the boddy

/* global Tone Tonal YOUTUBE ABCJS */

// eslint-disable-next-line no-unused-vars
const FUNCTIONS = (function () {
  'use strict'

  let player

  function metronome_data(bpm = 100) {
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
  }

  function randomNote_data(scale) {
    const note = pickRandom(allNotes())
    return {
      note: note(),
      getNote() {
        this.note = note()
      },
    }
  }

  function seekVideo(source, minsec = '00:00', videoNum = 0) {
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

  function replaceABCFences() {
    const abcNodes = document.querySelectorAll('code.language-abc')
    for (const node of abcNodes) {
      const abc = node.textContent
      const div = document.createElement('div')
      ABCJS.renderAbc(div, abc, { visualTranspose: -24, responsive: 'resize' })
      node.parentElement.appendChild(div)
      node.style.display = 'none'
    }
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    const rnd = Math.floor(Math.random() * (max - min)) + min
    return rnd
  }

  function allNotes() {
    const notes = Tonal.Range.chromatic(['C2', 'B2']).flatMap((n) => {
      const bare = Tonal.Note.get(n).pc // drop octave
      const enh = Tonal.Note.enharmonic(bare)
      return enh != bare ? [enh, bare] : bare
    })
    return notes
  }

  function pickRandom(items) {
    let lastIndex
    return function () {
      let index
      do {
        index = getRandomInt(0, items.length)
      } while (index === lastIndex)
      lastIndex = index
      return items[index]
    }
  }

  function init() {
    document.addEventListener('DOMContentLoaded', replaceABCFences)
  }

  return {
    metronome_data,
    randomNote_data,
    seekVideo,
    init,
  }
})()

FUNCTIONS.init()
