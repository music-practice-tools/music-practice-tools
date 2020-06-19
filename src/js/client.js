// Note this cannot be a module as would be defered, breaking refs in the body

/* global Tone Tonal YOUTUBE ABCJS */

// eslint-disable-next-line no-unused-vars
const CLIENT = (function () {
  'use strict'

  function getSearchParam(name) {
    const Wind = (0, eval)('this') // for some reason Window is not as expected
    const sp = new URLSearchParams(Wind.location.search)
    return sp.get(name)
  }

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
    const notes =
      scale == 'all-enharmonic' ? allNotes() : Tonal.Scale.get(scale).notes
    const note = pickRandom(notes)
    return {
      note: note(),
      getNote() {
        this.note = note()
      },
    }
  }

  function randomNumber_data(min, max) {
    min = parseInt(min, 10)
    max = parseInt(max, 10)
    const number = pickRandom(range(min, max))
    return {
      number: number(),
      getNote() {
        this.number = number()
      },
    }
  }

  function seekVideo(minsec = '00:00', videoNum = 0) {
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

  function timer_data(time, useURLTime) {
    const timesp = useURLTime ? this.getSearchParam('timer') : null
    time = timesp !== null ? timesp : time
    const body = document.querySelector('body')
    body.classList.add('has-timer')

    return {
      time: time * 60 * 1000,
      elapsedTime: 0,
      timer: undefined,
      auto: timesp !== null,

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

      reset() {
        this.elapsedTime = 0
      },
    }
  }

  // https://github.com/paulrosen/abcjs/blob/master/examples/full-synth.html
  const abcCursorControl = {
    onReady() {},

    onStart() {
      var svg = document.querySelector('.abcjs-container svg')
      var cursor = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line',
      )
      cursor.setAttribute('class', 'abcjs-cursor')
      cursor.setAttributeNS(null, 'x1', 0)
      cursor.setAttributeNS(null, 'y1', 0)
      cursor.setAttributeNS(null, 'x2', 0)
      cursor.setAttributeNS(null, 'y2', 0)
      svg.appendChild(cursor)
    },

    onEvent(ev) {
      if (ev.measureStart && ev.left === null) return // this was the second part of a tie across a measure line. Just ignore it.

      let lastSelection = document.querySelectorAll(
        '.abcjs-container svg .highlight',
      )
      for (var k = 0; k < lastSelection.length; k++)
        lastSelection[k].classList.remove('highlight')
      for (let i = 0; i < ev.elements.length; i++) {
        var note = ev.elements[i]
        for (let j = 0; j < note.length; j++) {
          note[j].classList.add('highlight')
        }
      }

      var cursor = document.querySelector('.abcjs-container svg .abcjs-cursor')
      if (cursor) {
        cursor.setAttribute('x1', ev.left - 2)
        cursor.setAttribute('x2', ev.left - 2)
        cursor.setAttribute('y1', ev.top)
        cursor.setAttribute('y2', ev.top + ev.height)
      }
    },

    onFinished() {
      var els = document.querySelectorAll('.abcjs-container svg .highlight')
      for (var i = 0; i < els.length; i++) {
        els[i].classList.remove('highlight')
      }
    },
  }

  function replaceABCFences() {
    const abcNodes = document.querySelectorAll('code.language-abc')
    for (const node of abcNodes) {
      let visualObj
      let synthControl

      // eslint-disable-next-line no-inner-declarations
      function abcClickListener(abcElem) {
        let lastClicked = abcElem.midiPitches
        if (!lastClicked) return

        ABCJS.synth
          .playEvent(
            lastClicked,
            abcElem.midiGraceNotePitches,
            synthControl.visualObj.millisecondsPerMeasure(),
          )
          .catch(function (error) {
            console.log('error playing note', error)
          })
      }

      const abc = node.textContent

      const divDisplay = document.createElement('div')
      visualObj = ABCJS.renderAbc(divDisplay, abc, {
        visualTranspose: -24, // makes notes easier to write in abc
        clickListener: abcClickListener,
        responsive: 'resize',
      })

      node.style.display = 'none' // hide the abc source
      const divAudio = document.createElement('div')
      divAudio.id = 'audioControls'
      node.parentElement.appendChild(divDisplay)
      node.parentElement.appendChild(divAudio)

      if (ABCJS.synth.supportsAudio()) {
        synthControl = new ABCJS.synth.SynthController()
        synthControl.load('#audioControls', abcCursorControl, {
          displayLoop: true,
          displayRestart: true,
          displayPlay: true,
          displayProgress: false,
          displayWarp: false,
        })
      }

      var midiBuffer = new ABCJS.synth.CreateSynth()
      midiBuffer
        .init({
          visualObj: visualObj[0],
          options: {
            soundFontUrl:
              'https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/',
          },
        })
        .then(function () {
          if (synthControl) {
            synthControl
              .setTune(visualObj[0], false, {
                midiTranspose: -8, // bass is 8VA compared to display
                program: 28, // picked bass as plucked (27) is horrid
                chordsOff: true,
              })
              .catch(function (error) {
                console.warn('Audio problem:', error)
              })
          }
        })
        .catch(function (error) {
          console.warn('Audio problem:', error)
        })
    }
  }

  // Inefficient but OK for small ranges
  function range(start, end) {
    if (start === end) return [start]
    return [start, ...range(start + 1, end)]
  }

  function randomInt(min, max) {
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
        index = randomInt(0, items.length)
      } while (index === lastIndex)
      lastIndex = index
      return items[index]
    }
  }

  return {
    getSearchParam,
    metronome_data,
    randomNote_data,
    randomNumber_data,
    timer_data,
    seekVideo,
    replaceABCFences,
  }
})()

document.addEventListener('DOMContentLoaded', CLIENT.replaceABCFences)
