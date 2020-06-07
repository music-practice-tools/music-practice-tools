/* global Tone Tonal */
var player

// eslint-disable-next-line no-unused-vars
function toggleMetronome(source, bpm) {
  const start = source.checked

  if (!player) {
    player = new Tone.Player('/sounds/woodblock.wav').toMaster()
    //player.volume.value = -6;

    Tone.Buffer.on('load', function () {
      Tone.Transport.scheduleRepeat(function (time) {
        player.start(time)
      }, '4n')
    })
  }

  if (start) {
    const others = document.querySelectorAll(
      '.metronome input[type="checkbox"]:checked',
    )
    others.forEach((e) => {
      if (e != source) {
        e.checked = false
      }
    })
    Tone.Transport.bpm.value = bpm
    Tone.Transport.start()
  } else {
    Tone.Transport.stop()
  }
}

// eslint-disable-next-line no-unused-vars
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  const rnd = Math.floor(Math.random() * (max - min)) + min
  return rnd
}

function allNotes() {
  const notes = Tonal.Range.chromatic(['C2', 'B2']).flatMap((n) => {
    const bare = Tonal.Note.get(n).pc // drop octave
    const en = Tonal.Note.enharmonic(bare)
    return en != bare ? [en, bare] : n
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

// eslint-disable-next-line no-unused-vars
function renderRandomNote(source, text, constraint) {
  if (!source.genFunc) {
    source.genFunc = pickRandom(allNotes())
  }
  const span = source.querySelector('span')
  span.innerText = source.genFunc()
}
