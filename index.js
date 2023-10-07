function distance(p1, p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

function vectorFrom(angle) {
	return { x: Math.cos(angle), y: Math.sin(angle) }
}

function createFlowPoints(w, h) {
	return Array.from({ length: 100 }, () => ({
		x: Math.random() * w,
		y: Math.random() * h,
		angle: (Math.random() * 360) * Math.PI / 180,
		intensity: Math.random()
	}))


	// return [
	// 	{ x: 50, y: 20, angle: -300 * Math.PI / 180, intensity: 0.5 },
	// 	{ x: 80, y: 60, angle: 20 * Math.PI / 180, intensity: 0.125 },
	// 	{ x: 80, y: 120, angle: 200 * Math.PI / 180, intensity: 0.5 },
	// 	{ x: 200, y: 80, angle: 270 * Math.PI / 180, intensity: 0.5 }
	// ]
}

function createSandPoints(w, h) {
	return Array.from({ length: 1000 }, () => ({
		x: Math.random() * w,
		y: Math.random() * h
	}))

	return [
		{ x: 10, y: 10 },
		{ x: 100, y: 100 },
		{ x: 200, y: 100 }
	]
}

function setup() {
	const canvas = document.getElementById('canvas')
	const context = canvas.getContext('2d', {
		alpha: true,
		colorSpace: 'display-p3'
	})

	context.imageSmoothingEnabled = false

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

	// if(Math.floor(time / 1000) % 2 === 0) {
		// console.log(time, Math.floor(time / 1000))
		context.fillStyle = 'rgba(0, 0, 20, 0.0125)'
		context.fillRect(0, 0, config.width, config.height)
		// context.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
	// }

	context.lineWidth = 1

	context.strokeStyle = 'rgb(100, 0, 100, 0.05)'
	flowPoints.forEach(({ x, y, angle, intensity }) => {
		context.save()
		context.beginPath()
		context.translate(x, y);
		context.rotate(angle);
		context.moveTo(0, 0)
		context.lineTo(intensity * 100, 0)
		context.stroke()
		context.resetTransform()
		context.restore()
	})


	context.fillStyle = 'pink'
	// const v = Math.random() * 255
	// context.fillStyle = `rgb(${v}, ${v}, ${v})`
	// console.log('sand', time)
	sand.forEach(({ x, y }) => {
		context.fillRect(x - 1, y - 1, 2, 2)
		context.fillRect(x, y, 1, 1)
	})

	config.sand = sand.map(p => {
		const temp = flowPoints.map(fp => ({
				fp, d: distance(fp, p)
			}))
		temp.sort(({ d: ad }, { d: bd }) => ad - bd)
		const closest = temp.map(({ fp }) => fp)[0]

		const vec = vectorFrom(closest.angle)
		// console.log(closest, vec)

		const x = p.x + vec.x
		const y = p.y + vec.y

		return { x, y }
	})

	const a = ((Math.random() * 2 - 1) * 15 * Math.PI / 180)
	config.flowPoints = flowPoints.map(fp => {
		return {
			...fp,
			angle: fp.angle + a
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