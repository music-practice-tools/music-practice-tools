// @ts-nocheck
import { readStorage, writeStorage } from './storage.js'

function stepper(min, max, step) {
  return (delta, count) => {
    const fnComp = delta > 1 ? Math.min : Math.max
    const limit = delta > 1 ? max : min
    return fnComp(limit, count + delta * step)
  }
}

export function counter_data(count, min, max, step, pid) {
  const key = pid ? `counter_${pid}` : null
  const _count = readStorage(key, count)

  return {
    count: _count,
    stepper: stepper(min, max, step),

    async onClick($el, $event) {
      const delta = $event.target.textContent == '-' ? -1 : 1
      this.count = this.stepper(delta, this.count)
      writeStorage(key, this.count)
    },
  }
}
