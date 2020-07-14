export function globalErrorHandler(msg, url, lineNo, columnNo, error) {
  console.error(`
  Script Error: ${msg}
  URL: ' + ${url}
  Line: ' + ${lineNo}
  Column: ' + ${columnNo}
  Error object: ' + ${JSON.stringify(error)},
`)

  alert('Something went a bit wrong. Perhaps try again?')

  return false
}
