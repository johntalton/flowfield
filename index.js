import { randomSandPoint, angleFrom } from './util.js'

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
	// return createFlowPoints_River(w, h)
	// return createFlowPoints_Fixed(w, h)
	// return createFlowPoints_Random(w, h)
	return createFlowPoints_Wave(w, h)
		.map(scatter)
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
	const length = 150
	return Array.from({ length }, (_e, i) => ({
		x: Math.random() * w,
		y: Math.random() * h,
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
			// x % 100
			angleFrom({ x, y }, { x: 1000, y: 500 }) * 2,
			Math.sin(y / h * 2 * Math.PI),
			// Math.sin(x / w * 2 * Math.PI),
			// Math.sin(x ^ y * .5),
			// Math.sin(wx / wd * 2 * Math.PI),
			// Math.cos(y / h) * 0.1
			// Math.sin((x / w * 2 * Math.PI) + (y / h * 2 * Math.PI)) * 0.3,
			// 1
			// -Math.sin(x * .01 + y * 0.001),
			Math.tan(x * y) * 0.5,
			// Math.sin(x & y),
			// Math.tan(y) * .125
			// Math.pow(Math.sqrt(x) + Math.sqrt(y), 2)
			// Math.sin(distance({ x, y }, { x: 0, y: 0 }) * 0.1)
			// vectorFrom(Math.sin(x)).x
		]
		const angle = waves.reduce((acc, value) => acc + value, 0) / waves.length

		return {
			x,
			y,
			angle,
			intensity: 1
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

	context.imageSmoothingEnabled = true

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

	const foo = createSandPoints(canvas.width, canvas.height)
		.filter((_, index) => index < 5)
		.map(sp => [ sp.x, sp.y, sp.age, 0 ])
		.flat()
		.map(Math.floor)
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
		// booster: instance
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

	//
	if(false) {
		const gradient = context.createLinearGradient(0, 0, config.width, config.height)
		gradient.addColorStop(0, 'rgb(10 40 60 / .1)')
		gradient.addColorStop(.25, 'rgb(50 0 0 / .1)')
		gradient.addColorStop(1, 'rgb(50 40 0 / .1)')
		context.fillStyle = gradient
		context.fillRect(0, 0, config.width, config.height)
	}

	//
	if(false) {
		context.lineWidth = 1
		context.strokeStyle = colors.debug
		flowPoints.forEach(({ x, y, angle, intensity }) => {
			context.save()
			context.beginPath()
			context.translate(x, y);
			context.rotate(angle);
			context.moveTo(0, 0)
			context.lineTo(intensity * 50, 0)
			context.stroke()
			context.resetTransform()
			context.restore()
		})
	}

	//
	// console.log(sand)
	sand.forEach(({ x, y, age }) => {
		context.fillStyle = age > 50 ? colors.color : colors.other
		context.fillRect(x, y, 1, 1)
	})

	//update(config, time)
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
}

async function onContentLoaded() {
	const config = await setup()

	const worker = new Worker('./worker.js', { type: 'module', name: 'compute-thread'})
	worker.onerror = event => console.warn('Worker Error', event)
	worker.onmessageerror = event => console.warn(event)
	worker.onunhandledrejection = event => console.warn(event.reason)
	worker.onmessage = event => {
		const { data, origin, lastEventId, source, port } = event
		handleWorkerMessage(config, data, port)
	}

worker.postMessage({ config: {
	...config,
	context: undefined,
	canvas: undefined
}})

	requestAnimationFrame(makeRenderOverConfig(config))
}

const syncOnContentLoaded = () => {
	onContentLoaded()
		.catch(console.warn)
}

(document.readyState === 'loading') ?
	document.addEventListener('DOMContentLoaded', syncOnContentLoaded) :
	syncOnContentLoaded()