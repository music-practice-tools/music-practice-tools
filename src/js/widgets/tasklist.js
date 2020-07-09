import { readStorage, writeStorage } from './storage.js'

function taskList_data(root, pid) {
  const storageKey = pid ? `tasklist_${pid}` : null
  const checkboxes = root.querySelectorAll('.task-list-item-checkbox')
  const initial = new Array(checkboxes.length).fill(false)

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
    init() {
      const items = readStorage(storageKey, initial)
      setBoxes(items)
    },

    reset() {
      setBoxes(initial)
      this.persist()
    },

    persist() {
      writeStorage(storageKey, getBoxes())
    },
  }
}

export { taskList_data }
