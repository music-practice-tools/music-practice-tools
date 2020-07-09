import { readStorage, writeStorage } from './storage.js'

const timers = {}
function lapTimer(timerid) {
  const timer = timers[timerid]
  if (timer) {
    timer.lap()
  }
}

function startTimer(timerid) {
  const timer = timers[timerid]
  if (timer) {
    timer.start()
  }
}

function getSearchParam(name) {
  const sp = new URLSearchParams(window.location.search)
  return sp.get(name)
}

function timer_data(time, useURLTime, pid, tid) {
  const timesp = useURLTime ? getSearchParam('timer') : null
  time = timesp !== null ? timesp : time
  const body = document.querySelector('body')
  body.classList.add('has-timer')
  const intialTime = { total: 0, elapsed: 0 }
  const storageKey = pid ? `timer_${pid}` : null

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
          if (this.auto) this.toggle()
        }
      }
      if (tid) {
        timers[tid] = this //TODO this is too fragile
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

export { timer_data, startTimer, lapTimer }
