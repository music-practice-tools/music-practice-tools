import { seekTo, setRenderFunc } from './youtube.js'

function videoSeekList_data(root, videoNum) {
  const seekButtons = [...root.querySelectorAll('button.seek-video')]

  return {
    looping: false,
    loopSeconds: parseInt(seekButtons[0].dataset.seconds),

    init() {
      setRenderFunc((player) => this.showTime(player))
    },

    showTime(player) {
      seekButtons.every((button, i, ar) => {
        // TODO can we make this more efficient
        const seconds = parseInt(button.dataset.seconds)
        const nextSeconds = ar[i + 1]
          ? parseInt(ar[i + 1].dataset.seconds)
          : Number.MAX_SAFE_INTEGER
        const time = player.getCurrentTime()
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
      seekTo(seconds, videoNum)
    },

    childClick(ev) {
      if (ev.target.dataset.widget == 'seekVideo') {
        const seconds = parseInt(ev.target.dataset.seconds)
        this.loopSeconds = seconds
        this.seekTo(seconds)
      }
    },
  }
}

export { videoSeekList_data }
export { init as initYoutube } from './youtube'
