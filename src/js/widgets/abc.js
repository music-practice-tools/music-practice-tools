import ABCJS from 'abcjs'

// https://github.com/paulrosen/abcjs/blob/master/examples/full-synth.html
const abcCursorControl = {
  onReady(controller) {
    this.svg = controller.options.divDisplay.querySelector('svg')
  },

  onStart() {
    const cursor = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'line',
    )
    cursor.setAttribute('class', 'abcjs-cursor')
    cursor.setAttributeNS(null, 'x1', '0')
    cursor.setAttributeNS(null, 'y1', '0')
    cursor.setAttributeNS(null, 'x2', '0')
    cursor.setAttributeNS(null, 'y2', '0')
    this.svg.appendChild(cursor)
  },

  onEvent(ev) {
    if (ev.measureStart && ev.left === null) {
      return
    } // this was the second part of a tie across a measure line. Just ignore it.

    const lastSelection = this.svg.querySelectorAll('.highlight')
    for (let k = 0; k < lastSelection.length; k++)
      lastSelection[k].classList.remove('highlight')
    for (let i = 0; i < ev.elements.length; i++) {
      let note = ev.elements[i]
      for (let j = 0; j < note.length; j++) {
        note[j].classList.add('highlight')
      }
    }

    const cursor = this.svg.querySelector('.abcjs-cursor')
    if (cursor) {
      cursor.setAttribute('x1', (ev.left - 2).toString())
      cursor.setAttribute('x2', (ev.left - 2).toString())
      cursor.setAttribute('y1', ev.top.toString())
      cursor.setAttribute('y2', (ev.top + ev.height).toString())
    }
  },

  onFinished() {
    const els = this.svg.querySelectorAll('.highlight')
    for (let i = 0; i < els.length; i++) {
      els[i].classList.remove('highlight')
    }
  },
}

function replaceABCFences() {
  const abcNodes = document.querySelectorAll('code.language-abc')
  abcNodes.forEach((node, i) => {
    // TODO consider optmising so not a synth per ABC section
    let visualObj
    let synthControl
    let tuneLoaded = false

    // eslint-disable-next-line no-inner-declarations
    function loadTune(interactive, divDisplay) {
      if (!tuneLoaded && synthControl) {
        const p = synthControl
          .setTune(visualObj[0], interactive, {
            chordsOff: true,
            divDisplay, // bit hacky but so CursorControl can access
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

      loadTune(true, divDisplay).then(() => {
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

    // @ts-ignore
    node.style.display = 'none' // hide the abc source

    const divAudio = document.createElement('div')
    divAudio.id = `audioControls${i}`
    node.parentElement.appendChild(divDisplay)
    node.parentElement.appendChild(divAudio)

    if (supportsAudio) {
      synthControl = new ABCJS.synth.SynthController()
      synthControl.load(`#audioControls${i}`, abcCursorControl, {
        displayLoop: true,
        displayRestart: true,
        displayPlay: true,
        displayProgress: false,
        displayWarp: false,
      })
    }

    // TODO this synth may be unnecessary - only used by click before playing
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
        loadTune(false, divDisplay)
      })
      .catch(function (error) {
        console.warn('Audio problem:', error)
      })
  })
}

function toggleABCSource(label) {
  const pre = label.nextElementSibling.firstChild
  pre.style.display = pre.style.display == '' ? 'none' : ''
}

export { replaceABCFences, toggleABCSource }
