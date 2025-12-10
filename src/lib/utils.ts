export function cn(...classes: (string|null|undefined|boolean)[]) {
	return classes.filter(Boolean).join(' ');
}

export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(value, max));
}

export function randomRange(min: number, max: number) {
	return lerp(min, max, Math.random());
}

export function inverseLerp(a: number, b: number, value: number, clamped: boolean = false) {
	if (a === b) return 0;
	const progress = (value - a) / (b - a);
	return clamped ? clamp(progress, 0, 1) : progress;
}

export function isBetween(value: number, min: number, max: number) {
	return value >= min && value <= max;
}