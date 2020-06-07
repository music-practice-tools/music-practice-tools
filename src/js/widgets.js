/* global Tone Tonal */

// eslint-disable-next-line no-unused-vars
var WIDGETS = (function () {
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

  function renderRandomNote(source, constraint) {
    if (!source.genFunc) {
      source.genFunc = pickRandom(allNotes())
    }
    const span = source.querySelector('span')
    span.innerText = source.genFunc()
  }

  return {
    toggleMetronome: toggleMetronome,
    renderRandomNote: renderRandomNote,
  }
})()
