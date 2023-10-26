export function lerp(delta, start, end) {
	return (delta * (end - start)) + start
}

export function mapRange(value, sourceStart, sourceEnd, destinationStart, destinationEnd) {
	const delta = (value - sourceStart) / (sourceEnd - sourceStart)
	return lerp(delta, destinationStart, destinationEnd)
}

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
	// const rise = p1.y - p2.y
	// const run = p1.x - p2.x
	// const slope = rise / run

	// // console.log(rise, run, slope)
	// return Math.atan(slope)


	const dy = p2.y - p1.y
	const dx = p2.x - p1.x
	return Math.atan2(dy, dx)
}

export function randomSandPoint(w, h) {
	return {
		x: Math.random() * w,
		y: Math.random() * h,
		age: Math.floor(Math.random() * 2000)
	}
}

export function* range(s, e, d) {
	for(let i = s; i < e; i++) {
		yield i
	}
}