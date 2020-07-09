import ABCJS from 'abcjs'

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

    const cursor = document.querySelector('.abcjs-container svg .abcjs-cursor')
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
    // TODO consider optmising so not a synth per ABC section
    let visualObj
    let synthControl
    let tuneLoaded = false

    // eslint-disable-next-line no-inner-declarations
    function loadTune(interactive) {
      if (!tuneLoaded && synthControl) {
        const p = synthControl
          .setTune(visualObj[0], interactive, {
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
        options: {
          soundFontUrl:
            'https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/',
        },
      })
      .then(function () {
        loadTune(false)
      })
      .catch(function (error) {
        console.warn('Audio problem:', error)
      })
  }
}

export { replaceABCFences }
