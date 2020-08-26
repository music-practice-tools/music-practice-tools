/* global YT */

function getYTFrames() {
  const frames = [...document.getElementsByTagName("iframe")];
  const ytFrames = frames.filter(
    (p) =>
      p.src.startsWith("https://www.youtube.com") ||
      p.src.startsWith("http://www.youtube.com")
  );
  return ytFrames;
}

function YTInject({ showOnPlay = false } = {}) {
  if (!getYTFrames().length) {
    return;
  }

  const head = document.querySelector("head");
  const body = document.querySelector("body");

  function injectStyles(where) {
    const style = document.createElement("style");
    style.innerHTML = `
div#mpt-videotime {
    position: fixed;
    right: 0.5em;
    top: 0.5em;
    font-size: 5vw;
    color: black;
    width:15%;
    text-align:center;
    background-color: yellow;
    padding: 0.2em;
    padding-bottom: 0.1rem;
    border: solid 0.05em  black;
    border-radius: 0.25em;
    font-family: Arial,helvetica,sans-serif;
    z-index: 9999;
    line-height: 0.8
}
div#mpt-videotime button {
    font-size: 0.4em;
    border: solid 0.1em black;
    border-radius: 0.25em;
    background-color: gold;
    width: 4.5em;
}
  `;
    where.insertAdjacentElement("afterbegin", style);
  }

  function injectDOM(where, showOnPlay = false) {
    const timeDiv = document.createElement("div");
    timeDiv.id = "mpt-videotime";
    if (showOnPlay) {
      timeDiv.style.display = "none";
    }
    const timeEl = document.createElement("div");
    timeEl.textContent = "00:00";

    const playEl = document.createElement("button");
    playEl.setAttribute("disabled", "");
    playEl.textContent = "-";

    timeDiv.append(timeEl, playEl);
    where.insertAdjacentElement("afterbegin", timeDiv);
  }

  function injectYTAPI(where) {
    // YouTube iFrame API
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.type = "text/javascript";
    where.insertAdjacentElement("afterbegin", script);
    // when ready this calls onYouTubeIframeAPIReady
  }

  injectStyles(head);
  injectDOM(body, showOnPlay);
  injectYTAPI(head);
}

// Needs to be a global function in order for YT iFrame API to call it
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  // TODO fix unsociable grabbing
  window.onunload = cleanup;

  let interval;

  function cleanup() {
    if (interval) {
      clearInterval(interval);
      interval = undefined;
    }
  }

  function enhanceYTFrames(ytFrames) {
    let currentPlayer = undefined;
    extendPlayer(YT.Player.prototype);

    ytFrames.forEach((frame, i) => {
      frame.src = frame.src.replace(
        "www.youtube.com",
        "www.youtube-nocookie.com"
      );
      console.log(frame.src);
      // Reload with API enabled
      frame.src += frame.src.includes("?") ? "" : "?feature=oembed";
      frame.src += `&enablejsapi=1&domain=${window.location.host}`;
      // @ts-ignore

      frame.ytPlayer = new YT.Player(frame, {
        events: {
          onStateChange: onPlayerStateChange,
          onReady: () => {
            // needs to be closure for frame
            callReadyFunc(frame, frame.ytPlayer);
          },
        },
      });
    });

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60).toString();
      const secs = Math.floor(seconds % 60).toString();
      return `${mins.padStart(2, "0")}:${secs.padStart(2, "0")}`;
    }

    function render(player) {
      if (!player) return;

      const div = document.querySelector("#mpt-videotime");

      const { time, isPlaying } = player.getPlayerTimeState();

      const timeEl = div.querySelector("div");
      timeEl.removeAttribute("disabled");
      timeEl.textContent = formatTime(time);

      const playEl = div.querySelector("button");
      playEl.removeAttribute("disabled");
      playEl.textContent = isPlaying ? "Pause" : "Play";

      // eslint-disable-next-line no-inner-declarations
      const fnClick = isPlaying ? player.pauseVideo : player.playVideo;
      playEl.onclick = () => {
        fnClick.bind(player)();
      };

      const stateFunc = player._yt_stateFunc;
      if (stateFunc) {
        stateFunc(time, isPlaying);
      }
    }

    function startPoll(player) {
      if (!interval) {
        interval = setInterval(() => {
          render(player);
        }, 450);
      }
    }

    function stopPoll() {
      cleanup();
    }

    function onPlayerStateChange(event) {
      const { data: playerStatus, target: player } = event;

      // @ts-ignore
      if (playerStatus == YT.PlayerState.PLAYING) {
        if (currentPlayer && currentPlayer !== player) {
          currentPlayer.pauseVideo();
        }
        currentPlayer = player;

        const divTimer = document.querySelector("#mpt-videotime");
        // @ts-ignore
        divTimer.style.display = "block";

        stopPoll();
        startPoll(player);
        render(player);
      } else if (
        // @ts-ignore
        [YT.PlayerState.ENDED, YT.PlayerState.PAUSED].includes(playerStatus)
      ) {
        if (currentPlayer === player) {
          stopPoll();
          render(player);
        }
      }
    }

    function extendPlayer(proto) {
      // TODO MDN says this kills optimisations
      proto.yt_seekToAndPlay = function (seconds) {
        this.seekTo(seconds, true);
        this.playVideo();
      };
      proto.yt_toggle = function () {
        const { isPlaying } = this.getPlayerTimeState();
        if (isPlaying) {
          this.pauseVideo();
        } else {
          this.playVideo();
        }
      };
      proto.yt_setStateFunc = function (func) {
        this._yt_stateFunc = func;
      };
      proto.getPlayerTimeState = function () {
        return {
          time: this.getCurrentTime(),
          // @ts-ignore
          isPlaying: this.getPlayerState() == YT.PlayerState.PLAYING,
        };
      };
    }

    render();
  }

  enhanceYTFrames(getYTFrames());
}

const readyFuncs = [];
function addReadyFunc(ytFrame, func) {
  readyFuncs.push({ ytFrame, func });
}
function callReadyFunc(frame, player) {
  const match = readyFuncs.filter(({ ytFrame }) => ytFrame === frame)[0];
  if (match) {
    match.func(player);
  }
}

function initYoutube() {
  YTInject({ showOnPlay: true });
}

// @ts-ignore
window.onYouTubeIframeAPIReady = function () {
  onYouTubeIframeAPIReady();
};

export { addReadyFunc, initYoutube };
