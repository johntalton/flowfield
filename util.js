
export function distance(p1, p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

export function vectorFrom(angle) {
	return { x: Math.cos(angle), y: Math.sin(angle) }
}

export function deg2rad(deg) {
	return deg / 360 * 2 * Math.PI
}

export function angleFrom(p1, p2) {
	const rise = p1.y - p2.y
	const run = p1.x - p2.x
	const slope = rise / run

	// console.log(rise, run, slope)
	return Math.atan(slope)
}

export function randomSandPoint(w, h) {
	return {
		x: Math.random() * w,
		y: Math.random() * h,
		age: Math.random() * 100 + 50
	}
}