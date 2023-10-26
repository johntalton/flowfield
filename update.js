import { distance, vectorFrom, mapRange, randomSandPoint } from './util.js'

export function update(config, time) {
  // console.log('running js update', config)
  if(config.sand === undefined) { return }
  if(config.flowPoints === undefined) { return }

	//
	// config.sand =
	config.sand.forEach(p => {
		// const temp = config.flowPoints.map(fp => ({
		// 		fp, d: distance(fp, p)
		// 	}))
		// temp.sort(({ d: ad }, { d: bd }) => ad - bd)
		// const [ closest, next ] = temp.map(({ fp }) => fp)

		// if(closest === undefined) {
		// 	console.warn('no closest in fieldPoints', config.flowPoints)
		// 	return p
		// }

		// const vec = vectorFrom(closest.angle)
		// const nextVec = vectorFrom(next.angle)
		// const nextD = distance(next, p)
		// const scale = distance(closest, p) / nextD
		// const nextVecScaled = {
		// 	x: nextVec.x * scale,
		// 	y: nextVec.y * scale
		// }

		// p.x = Math.max(10, Math.min(p.x + vec.x + nextVecScaled.x, config.width - 10))
		// p.y = Math.max(10, Math.min(p.y + vec.y + nextVecScaled.y, config.height - 10))
		// return





		const sumVec = config.flowPoints.reduce((acc, item) => {
			const d = distance(item, p)

			// if(Number.isNaN(item.x)) { throw new Error() }
			// if(Number.isNaN(item.y)) { throw new Error() }
			if(Number.isNaN(p.x)) { throw new Error('px') }
			if(Number.isNaN(p.y)) { throw new Error('py') }

			// if(d > 500) { return acc}
			const max = Math.max(config.width, config.height)

			const vec = vectorFrom(item.angle)
			// const f = mapRange(Math.min(d, max), 0, max, 1, 0)
			// const factor = 10 * Math.min(Math.max(0, f) , 1)

			if(d === 0) { return acc}

			const factor = 1 / (d * d * d) * Math.pow(item.intensity, 3)

			if(factor !== 0) {
				acc.x += (vec.x * factor)
				acc.y += (vec.y * factor)
			}
			// acc.d = d
			// acc.maxD = Math.max(d, acc.maxD)

			return acc

		}, { x: 0, y: 0 })

		if(Number.isNaN(sumVec.x)) { throw new Error('svx') }
		if(Number.isNaN(sumVec.y)) { throw new Error('svy') }

		const mag = Math.sqrt(sumVec.x * sumVec.x + sumVec.y * sumVec.y)
		if(mag <= 0) { return p }

		sumVec.x /= mag
		sumVec.y /= mag

		// capping max move size
		p.x += Math.min(sumVec.x, Number.POSITIVE_INFINITY)
		p.y += Math.min(sumVec.y, Number.POSITIVE_INFINITY)

		// bounds checking to create padding
		p.x = Math.max(10, Math.min(p.x, config.width - 10))
		p.y = Math.max(10, Math.min(p.y, config.height - 10))

		if(Number.isNaN(p.x)) { throw new Error('px a') }
		if(Number.isNaN(p.y)) { throw new Error('py a') }

		return p
	})

	//
	// config.sand =
	config.sand.forEach(p => {
		const age = p.age - 1

		if(age < 0) {
			// return {
			// 	...p,
			// 	...randomSandPoint(config.width, config.height)
			// }
			const newP = randomSandPoint(config.width, config.height)

			p.x = newP.x
			p.y = newP.y
			p.age = newP.age


			return
		}

		// return {
		// 	...p,
		// 	age
		// }
		p.age = age
	})

	//
	if(false) {
		const a = (Math.random() * 2 - 1) * 1
		// const c = Math.sin(((time % 30000) / 30000) * (2 * Math.PI)) * 0.005
		config.flowPoints = config.flowPoints.map(fp => {
			// const b = (Math.random() * 2 - 1) * 0.005
			// const d = Math.random() * 0.05

			if(fp.baseAngle === undefined) { fp.baseAngle = fp.angle }

			return {
				...fp,
				angle: fp.baseAngle + a,
			}
		})
	}
}