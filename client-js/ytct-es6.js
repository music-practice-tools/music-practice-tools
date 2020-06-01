/* uses some ES2015 features so a modern browser is required */

function getYTFrames() {
  const frames = [...document.getElementsByTagName('iframe')]
  const ytFrames = frames.filter(
    (p) =>
      p.src.startsWith('https://www.youtube.com') ||
      p.src.startsWith('http://www.youtube.com'),
  )
  return ytFrames
}

function mpt_inject({ showOnPlay = false } = {}) {
  if (!getYTFrames().length) {
    return
  }

  const head = document.querySelector('head')
  const body = document.querySelector('body')

  function injectStyles(where) {
    const style = document.createElement('style')
    style.innerHTML = `
    div#mpt-videotime {
        position: fixed;
        right: 0.5em;
        top: 0.5em;
        font-size: 3.5em;
        color: black;
        width:3.2em;
        text-align:center;
        background-color: yellow;
        padding: 0.2em;
        padding-bottom: 0.1em;
        border: solid thick black;
        border-radius: 0.25em;
        font-family: Arial,helvetica,sans-serif;
        z-index: 9999;
        line-height: 0.8
    }
    div#mpt-videotime button {
        font-size: 0.4em;
        border: solid thick black;
        border-radius: 0.25em;
        background-color: gold;
        width: 4.5em;
    }`
    where.insertAdjacentElement('afterbegin', style)
  }

  function injectDOM(where, showOnPlay = false) {
    const timeDiv = document.createElement('div')
    timeDiv.id = 'mpt-videotime'
    if (showOnPlay) {
      timeDiv.style.display = 'none'
    }
    const timeEl = document.createElement('div')
    timeEl.textContent = '00:00'

    const playEl = document.createElement('button')
    playEl.setAttribute('disabled', '')
    playEl.textContent = '-'

    timeDiv.append(timeEl, playEl)
    where.insertAdjacentElement('afterbegin', timeDiv)
  }

  function injectYTAPI(where) {
    // YouTube iFrame API
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.type = 'text/javascript'
    where.insertAdjacentElement('afterbegin', script)
    // when ready this calls onYouTubeIframeAPIReady
  }

  injectStyles(head)
  injectDOM(body, showOnPlay)
  injectYTAPI(head)
}

// Needs to be a function in order for YT iFrame API to call it
function onYouTubeIframeAPIReady() {
  window.onunload = cleanup

  let interval

  function cleanup() {
    if (interval) {
      clearInterval(interval)
      interval = undefined
    }
  }

  function enhanceYTFrames(ytFrames) {
    let currentPlayer = undefined

    ytFrames.forEach((frame, i, ar) => {
      // Reload with API enabled
      frame.src += frame.src.includes('?') ? '' : '?feature=oembed'
      frame.src += `&enablejsapi=1&domain=${window.location.host}`
      const player = new YT.Player(frame, {
        events: {
          onStateChange: onPlayerStateChange,
          onReady: (e) => {
            if (!currentPlayer) {
              currentPlayer = e.target
              render(e.target)
            }
          },
        },
      })
    })

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60).toString()
      const secs = Math.floor(seconds % 60).toString()
      return `${mins.padStart(2, '0')}:${secs.padStart(2, '0')}`
    }

    function render(player) {
      const div = document.querySelector('#mpt-videotime')

      if (!player) {
      } else {
        const timeEl = div.querySelector('div')
        timeEl.removeAttribute('disabled')
        timeEl.textContent = formatTime(player.getCurrentTime())

        const playEl = div.querySelector('button')
        playEl.removeAttribute('disabled')
        playEl.textContent = player.getPlayerState() == 1 ? 'Pause' : 'Play'
        function onClick() {
          if (player.getPlayerState() == YT.PlayerState.PLAYING) {
            player.pauseVideo()
          } else {
            player.playVideo()
          }
        }
        playEl.onclick = onClick
      }
    }

    function startPoll(player) {
      if (!interval) {
        interval = setInterval(() => render(player), 500)
      }
    }

    function stopPoll() {
      cleanup()
    }

    function onPlayerStateChange(event) {
      const { data: playerStatus, target: player } = event

      if (playerStatus == YT.PlayerState.PLAYING) {
        if (currentPlayer && currentPlayer !== player) {
          currentPlayer.pauseVideo()
        }
        currentPlayer = player

        const divTimer = document.querySelector('#mpt-videotime')
        divTimer.style.display = 'block'

        stopPoll()
        startPoll(player)
        render(player)
      } else if (
        [YT.PlayerState.ENDED, YT.PlayerState.PAUSED].includes(playerStatus)
      ) {
        if (currentPlayer === player) {
          stopPoll()
          render(player)
        }
      }
    }

    render()
  }

  enhanceYTFrames(getYTFrames())
}

document.addEventListener('DOMContentLoaded', () => {
  mpt_inject({ showOnPlay: false })
})
