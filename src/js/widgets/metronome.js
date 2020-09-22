// @ts-nocheck
//import Tone from '/js/vendor/tone/source/index.js'
const Tone = Function('return this')().Tone // using global script
import { readStorage, writeStorage } from './storage.js'

let player

function stepper(min, max, step) {
  return (delta, bpm) => {
    const fnComp = delta > 1 ? Math.min : Math.max
    const limit = delta > 1 ? max : min
    return fnComp(limit, bpm + delta * step)
  }
}

export function metronome_data(bpm, min, max, step, pid) {
  const key = pid ? `metronome_${pid}` : null
  const _bpm = readStorage(key, bpm)

  return {
    bpm: _bpm,
    checked: false,
    stepper: stepper(min, max, step),
    starting: false,

    onClick($el, $event, $dispatch) {
      // not from unCheckOthers
      $event.preventDefault() // we control check box state
      if (this.checked && $event.target.tagName == 'BUTTON') {
        const delta = $event.target.textContent == '<' ? -1 : 1
        this.bpm = this.stepper(delta, this.bpm)
        writeStorage(key, this.bpm)
      } else {
        this.checked = !this.checked
        if (this.checked) {
          this.starting = true
          $dispatch('metronome-start')
        }
      }
      this.renderAudio()
    },

    onStart() {
      if (!this.starting) {
        this.checked = false
      }
      this.starting = false
    },

    onStop() {
      this.checked = false
      this.renderAudio()
    },

    renderAudio() {
      if (!player) {
        player = new Tone.Player('/sounds/woodblock.wav').toDestination()
        Tone.loaded().then(function () {
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
