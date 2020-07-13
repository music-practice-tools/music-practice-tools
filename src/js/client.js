// @ts-ignore
window.parcelRequire = undefined // stop run warning from parcel

import { videoSeekList_data, initYoutube } from './widgets/videoseek.js'
import { timer_data } from './widgets/timer.js'
import { metronome_data } from './widgets/metronome.js'
import { randomNote_data, randomNumber_data } from './widgets/random.js'
import { activityList_data } from './widgets/activitylist.js'
import { replaceABCFences, toggleABCSource } from './widgets/abc.js'
import { recorder_data } from './widgets/recorder.js'

// provide access for global scripts - eg in HTML
// @ts-ignore
window.CLIENT = {
  metronome_data,
  randomNote_data,
  randomNumber_data,
  timer_data,
  activityList_data,
  recorder_data,
  videoSeekList_data,
  toggleABCSource,
}

document.addEventListener('DOMContentLoaded', () => {
  replaceABCFences()
  initYoutube()
})
