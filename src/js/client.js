import { videoSeekList_data, initVideo } from './widgets/videoseek.js'
import { timer_data } from './widgets/timer.js'
import { metronome_data } from './widgets/metronome.js'
import { counter_data } from './widgets/counter.js'
import { randomNote_data, randomNumber_data } from './widgets/random.js'
import { activityList_data } from './widgets/activitylist.js'
import { replaceABCFences, toggleABCSource } from './widgets/abc.js'
import { recorder_data } from './widgets/recorder.js'
import { globalErrorHandler } from './globalerror.js'

// provide access for global scripts - eg in HTML
// @ts-ignore
window.CLIENT = {
  metronome_data,
  counter_data,
  randomNote_data,
  randomNumber_data,
  timer_data,
  activityList_data,
  recorder_data,
  videoSeekList_data,
  toggleABCSource,
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    replaceABCFences()
    initVideo()
  },
  { once: true },
)

window.onerror = globalErrorHandler
