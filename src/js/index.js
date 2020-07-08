import CLIENT from './client'
//import alpine from 'alpinejs'
import YOUTUBE from './youtube'

const global = (0, eval)('this')

// eslint-disable-next-line no-unused-vars
global.onYouTubeIframeAPIReady = function () {
  YOUTUBE.onYouTubeIframeAPIReady()
}

global.CLIENT = CLIENT
