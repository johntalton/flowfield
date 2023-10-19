import { update } from './update.js'

// const mem = new WebAssembly.Memory({initial: 1})
// const module = await WebAssembly.compileStreaming(fetch('../booster/target/wasm32-unknown-unknown/release/booster.wasm'))
// const instance = await WebAssembly.instantiate(module, {
//   env: {
//     // logIt: (s) => console.log('here', s),
//     scratch: mem
//   },
//   // Math: { random: Math.random }
// })

// const ptr = instance.exports.sand(9)
// const memory = new Uint8Array(instance.exports.memory.buffer, ptr, 20)

// memory.set(Uint8Array.from([
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10
// ]))

function perfObserver(list, observer) {
  list.getEntries().forEach(entry => {
    switch(entry.entryType) {
      // case 'mark': console.log('>>>', entry.name, entry.startTime); break
      case 'measure': console.log('>>>', entry.name, entry.duration); break
    }
  })
}

const observer = new PerformanceObserver(perfObserver)
observer.observe({ entryTypes: ['measure', 'mark']})


export let config = {}

async function loopForever(options) {
  const { signal } = options

  const loopBody = () => {
    const ls = performance.mark('loop-start')
    if(config.sand === undefined) { return }

    update(config)

    postMessage({ sand: config.sand })

    // if(signal.aborted) { return }
    setTimeout(loopBody, 0)
    const le = performance.mark('loop-end')

    performance.measure('loop', 'loop-start', 'loop-end')
  }

  loopBody()
}

const controller = new AbortController()
setTimeout(() =>
  loopForever({ signal: controller.signal })
    .catch(e => console.warn(e)), 1000 * 1)

setTimeout(controller.abort('timeout now please'), 1000 * 10)

onmessage = event => {
  const { data, lastEventId, port } = event
  console.log('worker received message', data.config)
  config = data.config
}
