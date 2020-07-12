import { readStorage, writeStorage } from './storage.js'

const timers = {}

function getSearchParam(name) {
  const sp = new URLSearchParams(window.location.search)
  return sp.get(name)
}

function timer_data(time, useURLTime, pid, timerid) {
  const timesp = useURLTime ? getSearchParam('timer') : null
  time = timesp !== null ? timesp : time
  const body = document.querySelector('body')
  body.classList.add('has-timer')
  const initialTime = { total: 0, elapsed: 0 }
  const storageKey = pid ? `timer_${pid}` : null

  return {
    time: time * 60,
    total: 0,
    elapsed: 0,
    timer: undefined,
    auto: timesp !== null,

    init() {
      const { total, elapsed } = readStorage(storageKey, initialTime)
      this.total = total
      this.elapsed = elapsed
      if (useURLTime) {
        // Alpine runs this function after DOM updates
        return () => {
          if (this.auto) this.toggle()
        }
      }
      if (timerid) {
        timers[timerid] = this //TODO this is too fragile
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

    start() {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.total += 1
          this.elapsed += 1
        }, 1000)
      }
    },

    isRunning() {
      return !!this.timer
    },

    stop() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = undefined
      }
    },

    toggle() {
      if (!this.timer) {
        this.start()
      } else {
        this.stop()
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

// Careful, gives full access
function getTimer(timerid) {
  return timers[timerid]
}

export { timer_data, getTimer }
