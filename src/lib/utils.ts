export function cn(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

export function randomRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}