import { distance, vectorFrom, randomSandPoint } from './util.js'

export function update(config, time) {
  // console.log('running js update', config)
  if(config.sand === undefined) { return }
  if(config.flowPoints === undefined) { return }

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
		const a = (Math.random() * 2 - 1) * 0.0125
		// const c = Math.sin(((time % 30000) / 30000) * (2 * Math.PI)) * 0.005
		config.flowPoints = config.flowPoints.map(fp => {
			// const b = (Math.random() * 2 - 1) * 0.005
			// const d = Math.random() * 0.05
			return {
				...fp,
				angle: fp.angle + a
			}
		})
	}
}