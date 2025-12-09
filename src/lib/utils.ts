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

export function inverseLerp(a: number, b: number, value: number) {
	if (a === b) return 0;
	return (value - a) / (b - a);
}