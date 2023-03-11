import * as React from 'react'
import {client} from 'utils/api-client'

let queue = []

setInterval(sendReport, 5000)

function sendReport() {
  if (!queue.length) {
    return Promise.resolve({success: true})
  }

  const queueToSend = [...queue]
  queue = []

  return client('profile', {data: queueToSend})
}

function Profiler({phases, metadata, ...props}) {
  function reportProfile(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  ) {
    if (!phases || phases.includes(phase)) {
      queue.push({
        metadata,
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
      })
    }
  }
  return <React.Profiler onRender={reportProfile} {...props} />
}

export {Profiler}
