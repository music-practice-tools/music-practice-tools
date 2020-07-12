import { readStorage, writeStorage } from './storage.js'
import { getTimer } from './timer.js'

function activityList_data(root, timerid, pid) {
  const storageKey = pid ? `activityList_${pid}` : null
  const checkboxes = root.querySelectorAll('.task-list-item-checkbox')
  const initial = new Array(checkboxes.length).fill(false)
  const toggleButton = root.querySelector('.toggle')
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

    init() {
      const items = readStorage(storageKey, initial)
      setBoxes(items)
    },

    reset() {
      setBoxes(initial)
      this.persist()
      alert('r' + timer)
      if (timer) {
        timer.stop()
        timer.reset()
      }
    },

    persist() {
      writeStorage(storageKey, getBoxes())
    },

    childClick(ev) {
      const child = ev.target
      if (child.dataset.widget == 'activity') {
        this.persist()

        if (timer && child.checked) {
          timer.lap()
        }
      } else if (child.classList.contains('toggle')) {
        this.setTimeButtonState()
      } else if (child.classList.contains('reset')) {
        this.reset()
      }
    },

    setTimeButtonState() {
      if (timer) {
        toggleButton.textContent = timer.isRunning() ? 'Start' : 'Pause'
        timer.toggle()
      }
    },
  }
}

export { activityList_data }
