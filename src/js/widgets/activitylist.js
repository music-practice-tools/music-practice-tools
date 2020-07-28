import { readStorage, writeStorage } from './storage.js'
import { getTimer } from './timer.js'

function activityList_data(root, timerid, pid) {
  const storageKey = pid ? `activityList_${pid}` : null
  const checkboxes = root.querySelectorAll('.task-list-item-checkbox')
  const initial = new Array(checkboxes.length).fill(false)
  const timer = getTimer(timerid)

  const setBoxes = (items) => {
    checkboxes.forEach((c, i) => {
      return (c.checked = items[i])
    })
  }

  const getBoxes = () => {
    const items = []
    checkboxes.forEach((c, i) => (items[i] = c.checked))
    return items
  }

  return {
    hasTimer: !!timer,
    isRunning: false,
    toggleText() {
      return this.isRunning ? 'Pause' : 'Start'
    },

    init() {
      const items = readStorage(storageKey, initial)
      setBoxes(items)
    },

    reset() {
      setBoxes(initial)
      this.persist()
      if (timer) {
        timer.stop()
        timer.reset()
      }
    },

    persist() {
      writeStorage(storageKey, getBoxes())
    },

    childClick(ev, dispatch) {
      const child = ev.target
      if (child.dataset.widget == 'activity') {
        this.persist()

        if (timer && child.checked) {
          const time = child.dataset.time
          if (time != -1) {
            timer.setTime(parseInt(time))
            timer.start()
            timer.lap()
            this.isRunning = true
          }
        }
        dispatch('stop-sounds')
      } else if (child.classList.contains('toggle')) {
        timer.toggle()
        this.isRunning = timer.isRunning()
      } else if (child.classList.contains('reset')) {
        this.reset()
        this.isRunning = false
      } else if (child.classList.contains('stop')) {
        timer.stop()
        timer.lap()
        this.isRunning = false
      }
    },
  }
}

export { activityList_data }
