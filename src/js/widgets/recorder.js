function recorder_data(hasVideo, recordingTime) {
  const preview = document.getElementById(
    hasVideo ? 'preview-video' : 'preview-audio',
  )
  if (!preview) {
    return
  }

  function wait(delayInMS) {
    return new Promise((resolve) => setTimeout(resolve, delayInMS))
  }

  function recordStream(stream, time) {
    // @ts-ignore
    let recorder = new MediaRecorder(stream)
    let data = []

    recorder.ondataavailable = (event) => data.push(event.data)
    recorder.start()

    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve
      recorder.onerror = (event) => reject(event.name)
    })

    let recorded = wait(time * 1000).then(
      () => recorder.state == 'recording' && recorder.stop(),
    )

    return Promise.race([stopped, Promise.all([stopped, recorded])]).then(
      () => data,
    )
  }

  function record() {
    navigator.mediaDevices
      .getUserMedia({
        video: hasVideo,
        audio: true,
      })
      .then((stream) => {
        preview.loop = false
        preview.muted = true
        preview.autoplay = true
        /*
        preview.oncanplaythrough = () => console.info(`canplaythrough`)
        preview.onabort = () => console.info(`abort`)
        preview.onemptied = () => console.info(`emptied`)
        preview.onended = () => console.info(`ended:`)
        preview.onloadeddata = () => console.info(`loadeddata`)
        preview.onloadstart = () => console.info(`loadstart`)
        preview.onprogress = () => console.info(`progress`)
        preview.onstalled = () => console.info(`stalled`)
        preview.onsuspend = () => console.info(`suspend`)
        preview.onwaiting = () => console.info(`waiting`)
        */
        const p = new Promise((resolve, reject) => {
          preview.oncanplay = resolve
          preview.onerror = () => {
            reject(preview.error.message)
          }
        })
        preview.srcObject = stream
        return p
      })
      .then(() => {
        setButtonState('recording', preview.srcObject)
        return recordStream(preview.srcObject, recordingTime)
      })
      .then((recordedChunks) => {
        const recordedBlob = new Blob(recordedChunks, {
          type: hasVideo ? 'video/webm' : 'audio/ogg',
        })
        preview.loop = true
        preview.muted = false
        preview.srcObject = null
        preview.src = URL.createObjectURL(recordedBlob)
        setButtonState('looping')
      })
      .catch((err) => console.warn('Recorder error', err))
  }

  function buttonHandler(button, preview, record, stop) {
    let buttonClicked = () => {}
    button.addEventListener(
      'click',
      () => {
        buttonClicked()
      },
      false,
    )

    const saveButton = document.getElementById('recordersavebutton')

    const statefunc = (state, stream) => {
      const recorder = record
      if (state == 'stopped') {
        preview.classList.add('hidden')
        saveButton.classList.add('hidden')
        button.textContent = 'Record'
        buttonClicked = () => {
          recorder()
        }
      } else if (state == 'recording') {
        preview.classList.remove('hidden')
        button.textContent = 'Play'
        buttonClicked = () => {
          stop(stream)
        }
      } else if (state == 'looping') {
        preview.classList.remove('hidden')
        saveButton.classList.remove('hidden')
        button.textContent = 'End'
        buttonClicked = () => {
          preview.pause()
          statefunc('stopped')
        }
      }
    }
    return statefunc
  }

  function stop(stream) {
    stream.getTracks().forEach((track) => track.stop())
  }

  const button = document.getElementById('recorderbutton')
  const setButtonState = buttonHandler(button, preview, record, stop)
  preview.addEventListener('pause', () => {
    setButtonState('paused')
  })

  const saveButton = document.getElementById('recordersavebutton')
  saveButton.addEventListener(
    'click',
    () => {
      const saveAnchor = document.getElementById('recordersaveanchor')
      saveAnchor.setAttribute('href', preview.src)
      saveAnchor.setAttribute(
        'download',
        hasVideo ? 'mpt-video.webm' : 'mpt-audio.ogg',
      )
      saveAnchor.click()
    },
    false,
  )

  return {
    init() {
      setButtonState('stopped')
    },
  }
}

export { recorder_data }
