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
    const index = randomInt(0, items.length)
    const item = items[index]
    const _items = items.filter((i) => i != item)
    return { item, items: _items }
  }

  function autoid(prefix) {
    let _autoid = 0
    return () => `${prefix}_${(_autoid++).toString()}`
  }

  function persistedRandomItem(_items, key) {
    const defult = { item: undefined, items: [..._items] }
    const { item, items } = readStorage(key, defult)
    console.log(_items, key)

    return {
      item,
      get value() {
        if (this.item === undefined) {
          this.getNextItem()
        }
        return this.item
      },
      items: items,
      getNextItem() {
        if (!_items.length) {
          return
        }
        if (!this.items.length) {
          this.reset()
        } else {
          ;({ item: this.item, items: this.items } = pickRandom(this.items))
        }
        this._persist()
      },
      reset() {
        ;({ item: this.item, items: this.items } = defult)
        this.getNextItem()
      },
      _persist() {
        writeStorage(key, { item: this.item, items: this.items })
      },
    }
  }

  const autoIdNote = autoid('note')
  function randomNote_data(scale, id) {
    const items =
      scale == 'all-enharmonic' ? allNotes() : Tonal.Scale.get(scale).notes
    const _id = id != '' ? id : autoIdNote()
    console.log(scale, id)
    return persistedRandomItem(items, _id)
  }

  const autoIdNumber = autoid('number')
  function randomNumber_data(min, max, id) {
    min = parseInt(min, 10)
    max = parseInt(max, 10)
    const items = range(min, max)
    const _id = id != '' ? id : autoIdNumber()

    return persistedRandomItem(items, _id)
  }

  function seekVideo(minsec = '00:00', videoNum = 0) {
    const a = minsec.split(':')
    if (a.length == 1) {
      a.unshift('0')
    }
    const seconds = +a[0] * 60 + +a[1]

    YOUTUBE.seekTo(seconds, videoNum)
  }

  function timer_data(id, time, useURLTime) {
    const timesp = useURLTime ? this.getSearchParam('timer') : null
    time = timesp !== null ? timesp : time
    const body = document.querySelector('body')
    body.classList.add('has-timer')
    const intialTime = { total: 0, elapsed: 0 }
    const storageKey = `timer_${id}`

    return {
      time: time * 60,
      total: 0,
      elapsed: 0,
      timer: undefined,
      auto: timesp !== null,

      init() {
        const { total, elapsed } = readStorage(storageKey, intialTime)
        this.total = total
        this.elapsed = elapsed
        if (useURLTime) {
          // Alpine runs this function after DOM updates
          return () => {
            if (this.auto) this.btnAction()
          }
        }
      },

      format(time, h = true, s = true) {
        const date = new Date(null)
        date.setSeconds(time)
        const utc = date.toUTCString()
        const len = (h ? 3 : 0) + 2 + (s ? 3 : 0)
        const offset = h ? -2 : 1
        return utc.substr(utc.indexOf(':') + offset, len)
      },

      isExpired() {
        return this.elapsed >= this.time
      },

      btnText() {
        return this.timer ? 'Stp' : 'Sta'
      },

      btnAction() {
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.total += 1
            this.elapsed += 1
          }, 1000)
        } else {
          clearInterval(this.timer)
          this.timer = undefined
        }
      },

      lap() {
        this.elapsed = 0
        this.persist()
      },

      reset() {
        this.elapsed = this.total = 0
        this.persist()
      },

      persist() {
        writeStorage(storageKey, {
          total: this.total,
          elapsed: this.elapsed,
        })
      },
    }
  }

  // https://github.com/paulrosen/abcjs/blob/master/examples/full-synth.html
  const abcCursorControl = {
    onReady() {},

    onStart() {
      const svg = document.querySelector('.abcjs-container svg')
      const cursor = document.createElementNS(
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
      if (ev.measureStart && ev.left === null) {
        return
      } // this was the second part of a tie across a measure line. Just ignore it.

      const lastSelection = document.querySelectorAll(
        '.abcjs-container svg .highlight',
      )
      for (let k = 0; k < lastSelection.length; k++)
        lastSelection[k].classList.remove('highlight')
      for (let i = 0; i < ev.elements.length; i++) {
        let note = ev.elements[i]
        for (let j = 0; j < note.length; j++) {
          note[j].classList.add('highlight')
        }
      }

      const cursor = document.querySelector(
        '.abcjs-container svg .abcjs-cursor',
      )
      if (cursor) {
        cursor.setAttribute('x1', ev.left - 2)
        cursor.setAttribute('x2', ev.left - 2)
        cursor.setAttribute('y1', ev.top)
        cursor.setAttribute('y2', ev.top + ev.height)
      }
    },

    onFinished() {
      const els = document.querySelectorAll('.abcjs-container svg .highlight')
      for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('highlight')
      }
    },
  }

  function replaceABCFences() {
    const abcNodes = document.querySelectorAll('code.language-abc')
    for (const node of abcNodes) {
      // TODO concider optmising so not a synth per ABC section
      let visualObj
      let synthControl
      let tuneLoaded = false

      // eslint-disable-next-line no-inner-declarations
      function loadTune(interactive) {
        if (!tuneLoaded && synthControl) {
          const p = synthControl
            .setTune(visualObj[0], interactive, {
              /*soundFontUrl:
                'https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/',*/
              chordsOff: true,
            })
            .catch(function (error) {
              console.warn('Audio problem:', error)
            })
          tuneLoaded = true
          return p
        } else {
          return Promise.resolve()
        }
      }

      // eslint-disable-next-line no-inner-declarations
      function abcClickListener(abcElem) {
        // TODO use closure for now as synthControl is not passed
        const lastClicked = abcElem.midiPitches
        if (!lastClicked) return

        loadTune(true).then(() => {
          ABCJS.synth
            .playEvent(
              lastClicked,
              abcElem.midiGraceNotePitches,
              synthControl.visualObj.millisecondsPerMeasure(),
            )
            .catch(function (error) {
              console.warn('error playing note', error)
            })
        })
      }

      const abc = node.textContent
      const supportsAudio = ABCJS.synth.supportsAudio()

      const divDisplay = document.createElement('div')
      visualObj = ABCJS.renderAbc(divDisplay, abc, {
        visualTranspose: -24, // makes notes easier to write by transposing
        responsive: 'resize',
        clickListener: supportsAudio ? abcClickListener : undefined,
      })

      node.style.display = 'none' // hide the abc source

      const divAudio = document.createElement('div')
      divAudio.id = 'audioControls'
      node.parentElement.appendChild(divDisplay)
      node.parentElement.appendChild(divAudio)

      if (supportsAudio) {
        synthControl = new ABCJS.synth.SynthController()
        synthControl.load('#audioControls', abcCursorControl, {
          displayLoop: true,
          displayRestart: true,
          displayPlay: true,
          displayProgress: false,
          displayWarp: false,
        })
      }

      // TODO this synth may be unnessary - only used by click before playing
      let midiBuffer = new ABCJS.synth.CreateSynth()
      midiBuffer
        .init({
          visualObj: visualObj[0],
          soundFontUrl:
            'https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/',
        })
        .then(function () {
          loadTune(false)
        })
        .catch(function (error) {
          console.warn('Audio problem:', error)
        })
    }
  }

  function readStorage(key, def) {
    try {
      return JSON.parse(localStorage[key])
    } catch (e) {
      return def
    } // eslint-disable-line no-empty
  }

  function writeStorage(key, value) {
    try {
      localStorage[key] = JSON.stringify(value)
    } catch (e) {} // eslint-disable-line no-empty
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
