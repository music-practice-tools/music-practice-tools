import { seekTo, setRenderFunc } from './youtube.js'

function videoSeekList_data(root, videoNum) {
  const seekButtons = root.querySelectorAll('button.seek-video')

  return {
    init() {
      setRenderFunc((player) => this.showTime(player))
    },

    showTime(player) {
      seekButtons.forEach((button, i, ar) => {
        // TODO can we make this more efficient
        const seconds = button.dataset.seconds
        const nextSeconds =
          i == ar.length - 1
            ? Number.MAX_SAFE_INTEGER
            : seekButtons[i + 1].dataset.seconds
        const time = player.getCurrentTime()
        const played = seconds <= time
        const current = played && time < nextSeconds
        if (current) {
          button.style = 'color:var(--red); font-weight:bold;'
        } else if (played) {
          button.style = 'color:var(--darkred); font-weight:bold;'
        } else {
          button.style = ''
        }
      })
    },

    childClick(ev) {
      if (ev.target.dataset.widget == 'seekVideo') {
        seekTo(ev.target.dataset.seconds, videoNum)
      }
    },
  }
}

export { videoSeekList_data }
export { init as initYoutube } from './youtube'
