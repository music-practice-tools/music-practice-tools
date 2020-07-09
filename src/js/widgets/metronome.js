import Tone from 'tone'
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

    onClick($el, $event) {
      if ($event.isTrusted) {
        // not from unCheckOthers
        $event.preventDefault() // we control check box state
        if (this.checked && $event.target.tagName == 'BUTTON') {
          const delta = $event.target.textContent == '<' ? -1 : 1
          this.bpm = this.stepper(delta, this.bpm)
          writeStorage(key, this.bpm)
        } else {
          this.checked = !this.checked
          this.checked &&
            this.uncheckOthers($el.querySelector('input[type="checkbox"]'))
        }
        this.renderAudio()
      } else {
        this.checked = !this.checked
      }
    },

    uncheckOthers(source) {
      document
        .querySelectorAll('.metronome input[type="checkbox"]:checked')
        .forEach((e) => {
          if (e !== source) {
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
