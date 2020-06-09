/* global Tone Tonal ABCJS YOUTUBE */

// Not an ES6 module as exported symbols need to be in global namespace

const WIDGETS = (function () {
  'use strict'

  function uncheckOtherCheckBoxes(source, selector) {
    const all = document.querySelectorAll(`${selector}:checked`)
    all.forEach((e) => {
      if (e != source) {
        e.checked = false
      }
    })
  }

  var player

  function toggleMetronome(source, bpm) {
    console.log(source, bpm)
    const start = source.checked
    uncheckOtherCheckBoxes(source, '.metronome input[type="checkbox"]')

    if (!player) {
      player = new Tone.Player('/sounds/woodblock.wav').toMaster()
      Tone.Buffer.on('load', function () {
        Tone.Transport.scheduleRepeat(function (time) {
          player.start(time)
        }, '4n')
      })
    }

    if (start) {
      Tone.Transport.bpm.value = bpm
      Tone.Transport.start()
    } else {
      Tone.Transport.stop()
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

  function renderRandomNote(source /*, constraint*/) {
    if (!source.genFunc) {
      source.genFunc = pickRandom(allNotes())
    }
    const span = source.querySelector('span')
    span.innerText = source.genFunc()
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

  function init() {
    document.addEventListener('DOMContentLoaded', replaceABCFences)
  }

  return {
    toggleMetronome: toggleMetronome,
    renderRandomNote: renderRandomNote,
    seekVideo: seekVideo,
    init: init,
  }
})()

WIDGETS.init()
