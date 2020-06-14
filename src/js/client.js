// Note this cannot be a module as would be defered, breaking refs in the body

/* global Tone Tonal YOUTUBE ABCJS */

// eslint-disable-next-line no-unused-vars
const CLIENT = (function () {
  'use strict'

  let player

  function stepper(min, max, step) {
    return (delta, bpm) => {
      const fnComp = delta > 1 ? Math.min : Math.max
      const limit = delta > 1 ? max : min
      return fnComp(limit, bpm + delta * step)
    }
  }

  function metronome_data(bpm, min, max, step) {
    return {
      bpm: bpm,
      checked: false,
      stepper: stepper(min, max, step),

      onClick($el, $event) {
        if ($event.isTrusted) {
          // not from unCheckOthers
          $event.preventDefault() // we control check box state
          if (this.checked && $event.target.tagName == 'BUTTON') {
            const delta = $event.target.textContent == '<' ? -1 : 1
            this.bpm = this.stepper(delta, this.bpm)
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

  function timer_data(time) {
    return {
      time: time * 60 * 1000,
      elapsedTime: 0,
      timer: undefined,

      format(msTime, h = true, s = true) {
        const date = new Date(null)
        date.setSeconds(msTime / 1000)
        const utc = date.toUTCString()
        const len = (h ? 3 : 0) + 2 + (s ? 3 : 0)
        const offset = h ? -2 : 1
        return utc.substr(utc.indexOf(':') + offset, len)
      },

      isExpired() {
        return this.elapsedTime >= this.time
      },

      btnText() {
        return this.timer ? 'Stop' : 'Start'
      },

      btnAction() {
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.elapsedTime += 1000
          }, 1000)
        } else {
          clearInterval(this.timer)
          this.timer = undefined
        }
      },
      stop() {
        clearInterval(this.timer)
      },
      reset() {
        this.elapsedTime = 0
      },
    }
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

  return {
    metronome_data,
    randomNote_data,
    timer_data,
    seekVideo,
    replaceABCFences,
  }
})()

document.addEventListener('DOMContentLoaded', CLIENT.replaceABCFences)
