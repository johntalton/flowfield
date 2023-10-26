import { randomSandPoint, range, angleFrom, distance, vectorFrom, mapRange } from './util.js'


function scatterXY(fp, dx, dy) {
	const xscatter = dx * (Math.random() * 2 - 1)
	const yscatter = dy * (Math.random() * 2 - 1)

	return {
		...fp,
		x: fp.x + xscatter,
		y: fp.y + yscatter
	}
}

const scatter = fp => scatterXY(fp, 25, 25)

function createFlowPoints(w, h) {
	// return []
	return createFlowPoints_Pendulum(w, h)
	// return createFlowPoints_River(w, h)
	// return createFlowPoints_Fixed(w, h)
	// return createFlowPoints_Random(w, h)
	// return createFlowPoints_Wave(w, h)
		// .map(scatter)
}

function createFlowPoints_Pendulum(w, h) {
	function calcThetaDotDot(theta, theta_dot) {
		// 3Blue1Brown

		const g = 9.8
		const L = 4
		const mu = 0.6

		// definition of ODE
		return (-mu * theta_dot) - (g / L) * Math.sin(theta)
	}

	function calcTheta(theta, theta_dot, t = 1) {
		// solution to the differential equation
		const delta_t = 0.01

		for(let _ of range(0, t, delta_t)) {
			const thetaDD = thetaDotDot(theta, theta_dot)
			theta +=  theta_dot * delta_t
			theta_dot += thetaDD * delta_t
		}

		return theta
	}

	const fieldHeight = 20
	const fieldWidth = 30

	return Array.from({ length: fieldWidth * fieldHeight }, (e, fieldIndex) => {
		// field x,y
		const fieldX = fieldIndex % fieldWidth
		const fieldY = Math.floor(fieldIndex / fieldWidth)

		// canvas x,y
		const x = Math.round(fieldX / fieldWidth * w + w / fieldWidth / 2)
		const y = Math.round(fieldY / fieldHeight * h)

		//
		const theta = mapRange(fieldX, 0, fieldWidth, -2 * Math.PI, 2 * Math.PI)
		const thetaDot = mapRange(fieldY, 0, fieldHeight, 5, -5)

		//
		const thetaDotDot = calcThetaDotDot(theta, thetaDot)
		const nextTheta = theta + thetaDot * 0.01
		const nextThetaDot = thetaDot + thetaDotDot * 0.01

		//
		const dTheta = nextTheta - theta
		const dThetaDot = nextThetaDot - thetaDot
		const angle = -Math.atan2(dThetaDot, dTheta)

		const intensity =  Math.sqrt(dTheta * dTheta + dThetaDot * dThetaDot)

		return {
			x, y, angle, intensity
		}
	})
}

function createFlowPoints_River(w, h) {
	return [
		{ x: .11, y: .21, angle: 70 * Math.PI / 180, intensity: 0.5 },
		{ x: .41, y: .23, angle: 90 * Math.PI / 180, intensity: 0.5 },
		{ x: .63, y: .21, angle: 60 * Math.PI / 180, intensity: 0.5 },
		{ x: .93, y: .22, angle: 70 * Math.PI / 180, intensity: 0.5 },


		{ x: .13, y: .45, angle: -20 * Math.PI / 180, intensity: 1 },
		{ x: .23, y: .35, angle: 30 * Math.PI / 180, intensity: 0.5 },
		{ x: .32, y: .45, angle: 0 * Math.PI / 180, intensity: 0.5 },
		{ x: .42, y: .4, angle: 50 * Math.PI / 180, intensity: 0.5 },
		{ x: .52, y: .45, angle: -40 * Math.PI / 180, intensity: 0.5 },
		{ x: .61, y: .35, angle: 20 * Math.PI / 180, intensity: 0.5 },
		{ x: .71, y: .45, angle: 0 * Math.PI / 180, intensity: 0.5 },
		{ x: .81, y: .4, angle: 20 * Math.PI / 180, intensity: 0.5 },
		{ x: .91, y: .4, angle: -20 * Math.PI / 180, intensity: 0.75 },


		{ x: .11, y: .65, angle: -30 * Math.PI / 180, intensity: 1 },
		{ x: .21, y: .55, angle: 10 * Math.PI / 180, intensity: 0.5 },
		{ x: .33, y: .65, angle: 0 * Math.PI / 180, intensity: 0.5 },
		{ x: .43, y: .6, angle: 50 * Math.PI / 180, intensity: 0.5 },
		{ x: .52, y: .65, angle: -60 * Math.PI / 180, intensity: 0.5 },
		{ x: .62, y: .55, angle: 40 * Math.PI / 180, intensity: 0.5 },
		{ x: .72, y: .65, angle: -20 * Math.PI / 180, intensity: 0.5 },
		{ x: .83, y: .6, angle: -10 * Math.PI / 180, intensity: 0.5 },
		{ x: .94, y: .6, angle: 0 * Math.PI / 180, intensity: 1 },


		{ x: .1, y: .8, angle: 270 * Math.PI / 180, intensity: 0.5 },
		{ x: .4, y: .8, angle: 280 * Math.PI / 180, intensity: 0.5 },
		{ x: .6, y: .8, angle: 290 * Math.PI / 180, intensity: 0.5 },
		{ x: .9, y: .8, angle: 270 * Math.PI / 180, intensity: 0.5 }
	].map(fp => {
		return {
			...fp,
			x: fp.x * w,
			y: fp.y * h
		}

	})
}

function createFlowPoints_Fixed(w, h) {
	return [
		{ x: .1, y: .1, angle: 10 * Math.PI / 180, intensity: 0.5 },
		{ x: .5, y: .5, angle: 150 * Math.PI / 180, intensity: 0.5 },
		{ x: .3, y: .9, angle: 300 * Math.PI / 180, intensity: 0.5 },
		{ x: .75, y: .8, angle: 270 * Math.PI / 180, intensity: 0.5 }
	].map(fp => {
		return {
			...fp,
			x: fp.x * w,
			y: fp.y * h
		}

	})
}

function createFlowPoints_Random(w, h) {
	const length = 50
	return Array.from({ length }, (_e, i) => ({
		x: Math.random() * (w - 100),
		y: Math.random() * (h - 100),
		angle: (Math.random() * 360) * 2 * Math.PI,
		intensity: Math.random()
	}))
}

function createFlowPoints_Wave(w, h) {
	const hd = 20
	const wd = 40


	return Array.from({ length: wd * hd }, (e, i) => {
		const wx = i % wd
		const wy = Math.floor(i / wd)

		const x = wx / wd * w
		const y = wy / hd * h

		// console.log(i, { wx, wy }, { x, y })
		// console.log(angleFrom({ x, y}, { x: 0, y: 0 }))

		const waves = [
			// angleFrom({ x, y }, { x: 1000, y: 500 }) * 2,
			// Math.sin(y / h * 2 * Math.PI),
			// Math.tan(x * y) * 0.5,


			// Math.sin((x ^ y) * .5) * 0.75,
			// Math.sin((x / w * 2 * Math.PI) + (y / h * 2 * Math.PI)) * 0.3,



			// Math.sin(x / w * 2 * Math.PI),
			// Math.sin(wx / wd * 2 * Math.PI) * .75,
			// Math.cos(y / h) * 0.5,
			// Math.sin((x / w * 2 * Math.PI) + (y / h * 2 * Math.PI)) * 0.3,
			// 1
			// -Math.sin(x * .01 + y * 0.001),
			// (x * x  + y)% w,
			// Math.sin(x & y),
			// Math.tan(y) * .125,
			Math.sqrt(x) * Math.sqrt(y) * .1,
			// Math.sqrt(x + y)
			// Math.sin(distance({ x, y }, { x: 0, y: 0 }) * 0.1)
			// vectorFrom(Math.sin(x)).x
		]
		const angle = waves.reduce((acc, value) => acc + value, 0) / waves.length

		return {
			x,
			y,
			angle,
			intensity: Math.sin((y / h) / 2 / 2)
		}
	})
}

function createSandPoints(w, h) {
	return Array.from({ length: 1000 }, () => randomSandPoint(w, h))
}

async function setup() {

	const canvas = document.getElementById('canvas')
	const context = canvas.getContext('2d', {
		alpha: true,
		colorSpace: 'display-p3'
	})

	context.fillStyle = 'black'
	context.fillRect(0, 0, canvas.width, canvas.height)

	// console.log(context.getContextAttributes(), canvas.width, canvas.height, canvas.clientWidth, canvas.clientHeight)

	if(false) {
		const colors = [
			'red', 'green', 'blue', 'violet', 'cyan', 'pink', 'purple', 'white', 'black'
		]
		setInterval(() => {
			canvas.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)])
		}, 1000 * 15)
	}

	// const foo = createSandPoints(canvas.width, canvas.height)
	// 	.filter((_, index) => index < 5)
	// 	.map(sp => [ sp.x, sp.y, sp.age, 0 ])
	// 	.flat()
	// 	.map(Math.floor)
		//.map(ary => Uint16Array.from(ary))

	if(false) {
		const TIME_S = 1000 * 7
		let lastTime = -Infinity

		window.addEventListener('mousemove', e => {
			const { timeStamp } = e
			console.log('check')

			if(timeStamp - lastTime < TIME_S) { return }
			lastTime = timeStamp

			const body = document.querySelector('body')
			body.toggleAttribute('data-user-inactive', false)
		})

		const timer = setInterval(() => {
			const delta = performance.now() - lastTime

			if(delta < TIME_S) { return }

			lastTime = -Infinity

			const body = document.querySelector('body')
			body.toggleAttribute('data-user-inactive', true)

		}, TIME_S / 2)
	}



	return {
		height: canvas.height,
		width: canvas.width,
		context,
		canvas,
		flowPoints: createFlowPoints(canvas.width, canvas.height),
		sand: createSandPoints(canvas.width, canvas.height),
		last: new Map(),
		// booster: instance,
		paused: true
	}
}

function render(config, time) {
	const { context, flowPoints, sand } = config

	const styles = getComputedStyle(config.canvas)
	const colors = {
		debug: styles.getPropertyValue('--debug-color'),
		color: styles.getPropertyValue('--color'),
		other: styles.getPropertyValue('--other-color')
	}

	// context.clearRect(0, 0, config.width, config.height)

	//
	if(false) {
		context.globalCompositeOperation = 'lighten'
		context.fillStyle = 'rgba(0 0 0 / .01)'
		// context.fillStyle = 'black'
		context.fillRect(0, 0, config.width, config.height)
		context.globalCompositeOperation = 'normal'
	}

	//
	if(config.debug === true) {
		context.lineWidth = 1
		// context.strokeStyle = colors.debug
		flowPoints.forEach(({ x, y, angle, intensity }) => {
			const h = mapRange(intensity, 0, 1, 0, 360)
			const len = mapRange(intensity, 0, 1, 5, 300)

			context.fillStyle =`hsl(${h} 50% 50%)`
			context.fillRect(x -5, y - 5, 10, 10)

			context.save()
			context.strokeStyle =`hsl(${h} 50% 50%)`
			context.lineWidth = 5
			context.beginPath()
			context.translate(x, y);
			context.rotate(angle);
			context.moveTo(0, 0)
			context.lineTo(len, 0)
			context.stroke()
			context.resetTransform()
			context.restore()
		})
	}

	//
	context.globalCompositeOperation = 'lighten'

	sand.forEach(({ x, y, age }, i) => {
		const last = config.last.has(i) ? config.last.get(i) : { x, y }
		config.last.set(i, { x, y })

		const dx = Math.abs(x - last.x)
		const dy = Math.abs(y - last.y)

		context.strokeStyle = age > 100 ? colors.color : colors.other
		if(age > 2400) {
			context.strokeStyle = 'red'
		}

		if(dx < .1 && dy < .1) { return }

		if(dx < .5 && dy < .5) {
			// context.strokeStyle = 'white'
			context.strokeRect(x, y, 1, 1)
		}
		else {
			// context.strokeStyle = 'yellow'
			if(dx > 10 || dy > 10) { return }

			context.lineWidth = 1

			context.beginPath()
			context.moveTo(last.x, last.y)
			context.lineTo(x, y)
			context.stroke()
		}
	})

	context.globalCompositeOperation = 'normal'

	if(false) {
		context.fillStyle = 'rgba(0 0 0 / .125)'
		context.font = 'bold 280px sans-serif'
		context.textAlign = 'center'
		context.textBaseline = 'middle'
		context.fillText('FlowField', config.width / 2, config.height / 2, config.width)
	}
}

function makeRenderOverConfig(config) {
	const proxyRender = (time) => {

		render(config, time)

		// if(time > 30 * 1000) { console.log('render paused after time'); return }
		requestAnimationFrame(proxyRender)
	}
	return proxyRender
}

function handleWorkerMessage(config, data) {
	// console.log('message from worker', data)

	config.sand = data.sand

	if(config.paused === true) {
		requestAnimationFrame(makeRenderOverConfig(config))
		config.paused = false
	}
}

function createFlowPoints_Image(w, h, imageData) {
	const { data, height, width } = imageData

	const fieldW = 200
	const fieldH = 40

	const convolution = [
		-.25, -.25, -.25,
		0, 0, 0,
		.25, .25, .25,
	]

	// const convolution = [
	// 	-1, 0, 1,
	// 	-1, 0, 1,
	// 	-1, 0, 1
	// ]

	// const convolution = [
	// 	0, 1, 0,
	// 	1, -4, 1,
	// 	0, 1, 0
	// ]


	const convolutionSize = 3
	const convolutionLength = convolution.length * 4

	// console.log({ height, width, h, w})
	const edgeData = Uint8Array.from({ length: data.byteLength })
	for(let i = convolutionLength; i < edgeData.byteLength - convolutionLength; i += 4) {

		const value = convolution.map((value, index) => {
			const row = Math.floor(index / 3)
			const offset = i + (((row * width * 4) - (width * 4)))
			const r = data[offset + 0] * value
			const g = data[offset + 1] * value
			const b = data[offset + 2] * value

			return { r, g, b }
		})
		.reduce((acc, item) => {
			acc.r += item.r
			acc.g += item.g
			acc.b += item.b

			return acc
		}, { r: 0, g: 0, b: 0 })

		edgeData[i + 0] = value.r / convolution.length
		edgeData[i + 1] = value.g / convolution.length
		edgeData[i + 2] = value.b / convolution.length
	}

	return [
		{ x:10, y: 10, angle: 3.5, intensity: 1 },
		{ x: w - 10, y: 10, angle: Math.PI, intensity: 1 },
		{ x: w - 10, y: h - 10, angle: 4, intensity: 1 },
		{ x: 10, y: h - 10, angle: 5, intensity: 1 },
		...Array.from({ length: fieldW * fieldH }, (_, i) => {
		const fx = i % fieldW
		const fy = Math.floor(i / fieldW)
		// console.log(i, fx, fy)

		const ix = Math.floor(mapRange(fx, 0, fieldW, 0, width))
		const iy = Math.floor(mapRange(fy, 0, fieldH, 0, height))

		const iidx = iy * width + ix

		const pixelIndex = iidx * 4
		const r = edgeData[pixelIndex + 0]
		const g = edgeData[pixelIndex + 1]
		const b = edgeData[pixelIndex + 2]

		const grey = Math.floor((r + g + b) / 3)

		// console.log({ fx, fy, ix, iy, r, g, b, grey })
		const angle = mapRange(grey, 255, 0, 2 * Math.PI / 4,  0)
		// console.log(angle)

		// if(Number.isNaN(angle)) {
		// 	// console.log({ i, fx, fy, ix, iy, r, g, b, w, h, width, height, })
		// }

		const x = mapRange(fx, 0, fieldW, 0, w)
		const y = mapRange(fy, 0, fieldH, 0, h)

		return {
			x, y,
			angle,
			intensity: 0.05
		}
	})
	.filter(item => item.angle > 1 && item.angle < (2 * Math.PI))
	]
}

function handleForm(config, event) {
	event.preventDefault()
	event.stopPropagation()

	// form.disabled = true

	if(event.target.id === 'sourcePicker') {
		const [ file ] = event.target.files

		event.target.disabled = true

		// toss into space
		createImageBitmap(file)
			.then(imageBitmap => {
				const { width, height } = imageBitmap

				const offscreen = new OffscreenCanvas(width, height)
				const offscreenContext = offscreen.getContext('2d', {
					alpha: true,
					colorSpace: 'display-p3'
				})
				offscreenContext.imageSmoothingEnabled = false

				offscreenContext.drawImage(imageBitmap, 0, 0, width, height)

				// offscreenContext.fillStyle = 'white'
				// offscreenContext.fillRect(0, 0, width, height)
				// offscreenContext.fillStyle = 'black'
				// offscreenContext.font = 'bold 240px sans-serif'
				// offscreenContext.textAlign = 'center'
				// offscreenContext.textBaseline = 'middle'
				// offscreenContext.fillText('🤷🏻‍♂️', width / 2, height / 2, width * 0.80)

				const imageData = offscreenContext.getImageData(0, 0, width, height)

				// config.imageData = imageData
				config.flowPoints = createFlowPoints_Image(config.width, config.height, imageData)
				// console.log(config)

				config.context.clearRect(0, 0, config.width, config.height)

				config.worker.postMessage({ config: {
					...config,
					context: undefined,
					canvas: undefined,
					worker: undefined
				}})

				requestAnimationFrame(makeRenderOverConfig(config))

				event.target.disabled = false
			})
			.catch(e => console.warn(e))

	}
}

async function onContentLoaded() {
	const config = await setup()

	globalThis.handleForm = event => handleForm(config, event)

	window.addEventListener('keydown', event => {
		const keys = [ 'd',  ]
		if(!keys.includes(event.key)) { return }

		config.debug = !config.debug
	})

	const worker = new Worker('./worker.js', { type: 'module', name: 'compute-thread'})
	worker.onerror = event => console.warn('Worker Error', event)
	worker.onmessageerror = event => console.warn(event)
	worker.onunhandledrejection = event => console.warn(event.reason)
	worker.onmessage = event => {
		const { data, origin, lastEventId, source, port } = event
		handleWorkerMessage(config, data, port)
	}

	config.worker = worker

	worker.postMessage({ config: {
		...config,
		context: undefined,
		canvas: undefined,
		worker: undefined
	}})

	// requestAnimationFrame(makeRenderOverConfig(config))
}

const syncOnContentLoaded = () => {
	onContentLoaded()
		.catch(console.warn)
}

(document.readyState === 'loading') ?
	document.addEventListener('DOMContentLoaded', syncOnContentLoaded) :
	syncOnContentLoaded()