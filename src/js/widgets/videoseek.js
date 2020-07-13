import { seekTo, setRenderFunc } from './youtube.js'

function videoSeekList_data(root, videoNum) {
  const seekButtons = root.querySelectorAll('button.seek-video')

  return {
    init() {
      setRenderFunc((player) => this.showTime(player))
    },

    showTime(player) {
      seekButtons.forEach((button) => {
        // TODO can we make this more efficient
        const seconds = button.dataset.seconds
        if (seconds <= player.getCurrentTime()) {
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
