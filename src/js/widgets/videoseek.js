import { addReadyFunc } from './youtube.js'

function videoSeekList_data(root) {
  const seekButtons = [...root.querySelectorAll('button.seek-video')]
  const toggleButton = root.querySelector('.toggle')

  return {
    looping: false,
    showVideo: false,
    loopSeconds: parseInt(seekButtons[0].dataset.seconds),
    isPlaying: false,
    player: undefined,

    init() {
      const ytFrame = root.querySelector('iframe[src*="www.youtube.com"]')
      addReadyFunc(ytFrame, (player) => {
        this.player = player
        player.yt_setStateFunc((time, isPlaying) => {
          this.time = time
          this.isPlaying = isPlaying
          this.highlightTime(player)
        })
      })
    },

    toggleText() {
      return this.isPlaying ? 'Pause' : 'Start'
    },

    highlightTime(player) {
      seekButtons.every((button, i, ar) => {
        // TODO can we make this more efficient
        const seconds = parseInt(button.dataset.seconds)
        const nextSeconds = ar[i + 1]
          ? parseInt(ar[i + 1].dataset.seconds)
          : Number.MAX_SAFE_INTEGER
        const time = this.time
        const played = seconds <= time
        const current = played && time < nextSeconds
        if (
          this.looping &&
          seconds == this.loopSeconds &&
          (time >= nextSeconds || player.getPlayerState() == 0)
        ) {
          this.seekTo(this.loopSeconds)
          return false
        }

        if (current) {
          button.style = 'color:var(--red); font-weight:bold;'
        } else if (played) {
          button.style = 'color:var(--darkred); font-weight:bold;'
        } else {
          button.style = ''
        }

        return true
      })
    },

    seekTo(seconds) {
      if (this.player) {
        this.player.yt_seekToAndPlay(seconds)
      }
    },

    childEvent(ev) {
      const child = ev.target
      if (child && child.dataset && child.dataset.widget == 'seekVideo') {
        const seconds = parseInt(ev.target.dataset.seconds)
        this.loopSeconds = seconds
        this.seekTo(seconds)
      } else if (child && child.classList.contains('toggle')) {
        if (this.player) {
          this.player.yt_toggle()
        }
      } else if (child && child.classList.contains('speed')) {
        if (this.player) {
          const rate = parseFloat(ev.target.value)
          this.player.setPlaybackRate(rate)
        }
      }
    },
  }
}

// Wrap so can be responsive
function wrapVideo() {
  const elements = document.querySelectorAll('.video-embed')
  for (const element of elements) {
    var parent = element.parentNode
    var wrapper = document.createElement('div')
    wrapper.className = 'video-embed-wrapper'
    parent.replaceChild(wrapper, element)
    wrapper.appendChild(element)
  }
}

import { initYoutube } from './youtube'

function initVideo() {
  wrapVideo()
  initYoutube()
}

export { videoSeekList_data, initVideo }
