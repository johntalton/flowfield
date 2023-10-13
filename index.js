// import { goBind } from './booster/pkg/booster.js'

function distance(p1, p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

function deg2rad(deg) {
	return deg / 360 * 2 * Math.PI
}

function vectorFrom(angle) {
	return { x: Math.cos(angle), y: Math.sin(angle) }
}

function angleFrom(p1, p2) {
	const rise = p1.y - p2.y
	const run = p1.x - p2.x
	const slope = rise / run

	// console.log(rise, run, slope)
	return Math.atan(slope)
}

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
	// return createFlowPoints_Fixed(w, h)
	// return createFlowPoints_Random(w, h)
	return createFlowPoints_Wave(w, h)
		.map(scatter)
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

function randomSandPoint(w, h) {
	return {
		x: Math.random() * w,
		y: Math.random() * h,
		age: Math.random() * 100 + 50
	}
}

function createSandPoints(w, h) {
	return Array.from({ length: 100 }, () => randomSandPoint(w, h))
}

async function setup() {
	// const mem = new WebAssembly.Memory({initial: 1})
	// const module = await WebAssembly.compileStreaming(fetch('../booster/target/wasm32-unknown-unknown/release/booster.wasm'))
	// const instance = await WebAssembly.instantiate(module, {
	// 	env: {
	// 		// logIt: (s) => console.log('here', s),
	// 		// scratch: mem
	// 	},
	// 	// Math: { random: Math.random }
	// })

	// const ptr = instance.exports.sand(9)
	// const memory = new Uint8Array(instance.exports.memory.buffer, ptr, 20)


	const canvas = document.getElementById('canvas')
	const context = canvas.getContext('2d', {
		alpha: true,
		colorSpace: 'display-p3'
	})

	context.imageSmoothingEnabled = true

	context.fillStyle = 'black'
	context.fillRect(0, 0, canvas.width, canvas.height)

	console.log(context.getContextAttributes(), canvas.width, canvas.height, canvas.clientWidth, canvas.clientHeight)

	if(false) {
		const colors = [
			'red', 'gree', 'blue', 'violet', 'cyan', 'pink', 'purple', 'white', 'black'
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

	// memory.set(foo)
	// console.log(...memory)

	// setInterval(() => {
	// 	instance.exports.stepSand(false)
	// 	console.log(...memory)
	// }, 1000 * 4)



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

function update(config, time) {
	//
	config.sand = config.sand.map(p => {
		const temp = config.flowPoints.map(fp => ({
				fp, d: distance(fp, p)
			}))
		temp.sort(({ d: ad }, { d: bd }) => ad - bd)
		const [ closest, next ] = temp.map(({ fp }) => fp)

		const vec = vectorFrom(closest.angle)
		const nextVec = vectorFrom(next.angle)
		const nextD = distance(next, p)
		const scale = distance(closest, p) / nextD
		const nextVecScaled = {
			x: nextVec.x * scale,
			y: nextVec.y * scale
		}

		const x = Math.max(10, Math.min(p.x + vec.x + nextVecScaled.x, config.width - 10))
		const y = Math.max(10, Math.min(p.y + vec.y + nextVecScaled.y, config.height - 10))

		return { ...p, x, y }
	})

	//
	config.sand = config.sand.map(p => {
		const age = p.age - 1

		if(age < 0) {
			return {
				...p,
				...randomSandPoint(config.width, config.height)
			}
		}

		return {
			...p,
			age
		}
	})

	//
	if(true) {
		const a = (Math.random() * 2 - 1) * 0.005
		const c = Math.sin(((time % 30000) / 30000) * (2 * Math.PI)) * 0.005
		config.flowPoints = config.flowPoints.map(fp => {
			const b = (Math.random() * 2 - 1) * 0.005
			const d = Math.random() * 0.05
			return {
				...fp,
				angle: fp.angle + a
			}
		})
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
	if(true) {
		const gradient = context.createLinearGradient(0, 0, config.width, config.height / 2)
		gradient.addColorStop(0, 'rgb(0 30 50 / .01)')
		gradient.addColorStop(.25, 'rgb(50 0 0 / .01)')
		gradient.addColorStop(1, 'rgb(50 40 0 / .01)')
		// context.fillStyle = 'rgba(40, 0, 35, 0.01)'
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
	sand.forEach(({ x, y, age }) => {
		context.fillStyle = age > 50 ? colors.color : colors.other
		context.fillRect(x, y, 1, 1)
	})

	update(config, time)
}

function makeRenderOverConfig(config) {
	const proxyRender = (time) => {

		render(config, time)

		// if(time > 30 * 1000) { console.log('render paused after time'); return }
		requestAnimationFrame(proxyRender)
	}
	return proxyRender
}

async function onContentLoaded() {
	const config = await setup()
	requestAnimationFrame(makeRenderOverConfig(config))
}

const syncOnContentLoaded = () => {
	onContentLoaded()
		.catch(console.warn)
}

(document.readyState === 'loading') ?
	document.addEventListener('DOMContentLoaded', syncOnContentLoaded) :
	syncOnContentLoaded()