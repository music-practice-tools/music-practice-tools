function readStorage(key, def) {
  if (!key) {
    return def
  }
  try {
    return JSON.parse(localStorage[key])
  } catch (e) {
    return def
  } // eslint-disable-line no-empty
}

function writeStorage(key, value) {
  if (!key) {
    return
  }
  try {
    localStorage[key] = JSON.stringify(value)
  } catch (e) {} // eslint-disable-line no-empty
}

export { readStorage, writeStorage }
