// @ts-ignore
window.parcelRequire = undefined // stop run warning from parcel

import { seekTo } from './widgets/youtube.js'
import { timer_data } from './widgets/timer.js'
import { metronome_data } from './widgets/metronome.js'
import { randomNote_data, randomNumber_data } from './widgets/random.js'
import { activityList_data } from './widgets/activitylist.js'
import { replaceABCFences } from './widgets/abc.js'
import { recorder_data } from './widgets/recorder.js'

// provide access for global scripts - eg in HTML
// @ts-ignore
window.CLIENT = {
  metronome_data,
  randomNote_data,
  randomNumber_data,
  timer_data,
  activityList_data,
  replaceABCFences,
  recorder_data,
  seekVideo,
  toggleABCSource,
}

function seekVideo(minsec = '00:00', videoNum = 0) {
  const a = minsec.split(':')
  if (a.length == 1) {
    a.unshift('0')
  }
  const seconds = +a[0] * 60 + +a[1]

  seekTo(seconds, videoNum)
}

function toggleABCSource(label) {
  const pre = label.nextElementSibling.firstChild
  pre.style.display = pre.style.display == '' ? 'none' : ''
}

document.addEventListener('DOMContentLoaded', replaceABCFences)
