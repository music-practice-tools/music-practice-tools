import { Tonal } from '@tonaljs/tonal'

import { readStorage, writeStorage } from './storage.js'

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

function pickRandom(items) {
  const index = randomInt(0, items.length)
  const item = items[index]
  const _items = items.filter((i) => i != item)
  return { item, items: _items }
}

function persistedRandomItem(_items, key) {
  const defult = { item: undefined, items: [..._items] }
  const { item, items } = readStorage(key, defult)

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

const circleoffourthsNotes = [
  'C',
  'F',
  'Bb',
  'Eb',
  'Ab',
  'Db',
  'Gb',
  'F#',
  'B',
  'E',
  'A',
  'D',
  'G',
]

function randomNote_data(scale, pid) {
  const items =
    scale == 'circleoffourths'
      ? circleoffourthsNotes
      : Tonal.Scale.get(scale).notes
  const key = pid ? `note_${pid}` : null
  return persistedRandomItem(items, key)
}

function randomNumber_data(min, max, pid) {
  min = parseInt(min, 10)
  max = parseInt(max, 10)
  const items = range(min, max)
  const key = pid ? `number_${pid}` : null

  return persistedRandomItem(items, key)
}

export { randomNote_data, randomNumber_data }
