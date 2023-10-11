function distance(p1, p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

function deg2rad(deg) {
	return deg / 360 * 2 * Math.PI
}

function vectorFrom(angle) {
	return { x: Math.cos(angle), y: Math.sin(angle) }
}

function createFlowPoints(w, h) {
	// return createFlowPoints_Fixed(w, h)
	return createFlowPoints_Random(w, h)
	// return createFlowPoints_Wave(w, h)
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

		const waves = [
			// Math.sin(y / h * 2 * Math.PI),
			Math.sin(x / w * 2 * Math.PI),
			// Math.sin(x ^ y * .5),
			// Math.sin(wx / wd * 2 * Math.PI)
			// Math.cos(y / h) * 0.1
			// Math.sin((x / w * 2 * Math.PI) + (y / h * 2 * Math.PI)) * 0.3,
			// 1
			// -Math.sin(x * .01 + y * 0.001),
			// Math.tan(x * y) * 0.1
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
		age: Math.random() * 150 + 100
	}
}

function createSandPoints(w, h) {
	return Array.from({ length: 100 }, () => randomSandPoint(w, h))
}

function setup() {
	const canvas = document.getElementById('canvas')
	const context = canvas.getContext('2d', {
		alpha: true,
		colorSpace: 'display-p3'
	})

	context.imageSmoothingEnabled = true

	context.fillStyle = 'black'
	context.fillRect(0, 0, canvas.width, canvas.height)

	console.log(context.getContextAttributes(), canvas.width, canvas.height, canvas.clientWidth, canvas.clientHeight)

	return {
		height: canvas.height,
		width: canvas.width,
		context,
		flowPoints: createFlowPoints(canvas.width, canvas.height),
		sand: createSandPoints(canvas.width, canvas.height)
	}
}

function render(config, time) {
	const { context, flowPoints, sand } = config

	//
	context.fillStyle = 'rgba(0, 0, 0, 0.02)'
	context.fillRect(0, 0, config.width, config.height)

	//
	if(true) {
		context.lineWidth = 1
		context.strokeStyle = 'rgb(200, 0, 100, .001)'
		flowPoints.forEach(({ x, y, angle, intensity }) => {
			context.save()
			context.beginPath()
			context.translate(x, y);
			context.rotate(angle);
			context.moveTo(0, 0)
			context.lineTo(intensity * 150, 0)
			context.stroke()
			context.resetTransform()
			context.restore()
		})
	}

	//
	sand.forEach(({ x, y, age }) => {
		context.fillStyle = age > 50 ? 'rgba(80, 0, 75, 0.5)' : 'rgba(100, 10, 10, 0.5)'
		context.fillRect(x, y, 1, 1)
	})

	//
	config.sand = config.sand.map(p => {
		const temp = flowPoints.map(fp => ({
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
	const a = (Math.random() * 2 - 1) * 0.005
	const c = Math.sin(((time % 30000) / 30000) * (2 * Math.PI)) * 0.005
	config.flowPoints = flowPoints.map(fp => {
		const b = (Math.random() * 2 - 1) * 0.005
		return {
			...fp,
			angle: fp.angle
		}
	})
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
	const config = setup()
	requestAnimationFrame(makeRenderOverConfig(config))
}

const syncOnContentLoaded = () => {
	onContentLoaded()
		.catch(console.warn)
}

(document.readyState === 'loading') ?
	document.addEventListener('DOMContentLoaded', syncOnContentLoaded) :
	syncOnContentLoaded()