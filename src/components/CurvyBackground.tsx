import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { randomRange } from '../lib/utils';

const COLOR_1 = "#c15325";
const COLOR_2 = "#c7707e";

const SCROLL_V_AMPLITUDE=0.7
const SCROLL_H_AMPLITUDE=0.5;

const ROTATION_AMPLITUDE=4;

const WAVE_COUNT = 8;

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

const CURVES_MARGIN = 200;

export default function CurvyBackground() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isMounted, setIsMounted] = useState(false);

	const updateBackground = useCallback(() => {
		const scroll = window.scrollY;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		const scrollRatio = docHeight > 0 ? scroll / docHeight : 0;
		

		if (containerRef.current) {
			const verticalOffset = -(1 - scrollRatio) * SCROLL_V_AMPLITUDE * window.innerHeight;
			containerRef.current.style.transform = `translateY(${verticalOffset}px)`;
		}
	}, []);

  
	useEffect(() => {
		setIsMounted(true);
		updateBackground();
		const handleScroll = () => {
			updateBackground();
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [updateBackground, isMounted]);



	const waves = useMemo(() => {

		const hInterval = CANVAS_HEIGHT / (2 * WAVE_COUNT);
		const waveData = Array.from({ length: WAVE_COUNT }, (_, i) => ({
			y0: 2 * i * hInterval,
			height: hInterval,
			index: i,
			color: COLOR_2
		}));

		return waveData;
	}, [CANVAS_HEIGHT, WAVE_COUNT])
	
	const containerSize = 100 * Math.max(1 + SCROLL_V_AMPLITUDE, 1 + SCROLL_H_AMPLITUDE)

	if (!isMounted) return null;

	return <div className="fixed inset-0 -z-10 overflow-hidden">
		<div className="absolute left-0" style={{
			width: `${containerSize}%`,
			height: `${containerSize}%`,
			transform: `translateX(-${SCROLL_H_AMPLITUDE * window.innerWidth / 2}px)`,
			backgroundColor: COLOR_1
		}}>
        <div ref={containerRef} className="w-full h-full absolute left-0">
			<svg
				className="w-full h-full"
				viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="xMidYMid slice"
			>
				{waves.map((wave, i) => <WavyPath key={i} {...wave} />)}
			</svg>
			</div>
		</div>
	</div>
}

type WavyPathProps = {
	y0: number;
	height: number;
	index: number;
	color: string;
}

function generateWaveInitialData(height: number) {
	const c1 = [
		randomRange(100, 200),
		randomRange(80, 180)
	];

	const c2 = [
		randomRange(800, 900),
		-randomRange(70, 170)
	];

	const c3 = [
		randomRange(800, 900),
		-randomRange(70, 170) + height
	];

	const c4 = [
		randomRange(100, 200),
		randomRange(80, 180) + height
	];

	const r0 = randomRange(-1, 0);
	const tx0 = randomRange(-1, 0);

	return { c1, c2, c3, c4, r0, tx0 };
}

function WavyPath(props: WavyPathProps) {
	const {
		y0,
		height,
		index: i,
		color
	} = props;

	const pathRef = useRef<SVGPathElement>(null);

	const waveData = useMemo<ReturnType<typeof generateWaveInitialData>>(() => generateWaveInitialData(height), [height]);

	const updatePath = useCallback(() => {

		const { r0, tx0 } = waveData;
		const scroll = window.scrollY;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		const scrollRatio = docHeight > 0 ? scroll / docHeight : 0;

		const path = pathRef.current;
		if (path) {

			const rotationA = Math.abs(r0 + scrollRatio);
			const translateXA = Math.abs(tx0 + scrollRatio);

			const rotation = (i % 4 < 2 ? 1 : -1) * rotationA * ROTATION_AMPLITUDE / 2;
			const translateX = (i % 2 === 0 ? -1 : 1) * translateXA * SCROLL_H_AMPLITUDE * window.innerWidth / 2;

			path.style.transform = `translate3d(${translateX}px, ${y0}px, 0) rotate(${rotation}deg)`;
		}
	}, [waveData, y0, i]);

	useEffect(() => {
		updatePath();
		window.addEventListener('scroll', updatePath);
		return () => window.removeEventListener('scroll', updatePath);
	}, [updatePath]);

	const transformOrigin = useMemo(() => {
		return `${randomRange(0.2, 0.8) * 100}% 50%`
	}, []);

	const d = useMemo(() => {
		const { c1, c2, c3, c4 } = waveData;
		const start = [-CURVES_MARGIN, 0];
		const end = [CANVAS_WIDTH + CURVES_MARGIN, 0];

		const result = [
			`M${start[0]},${start[1]}`,
			`C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${end[0]},${end[1]}`,
			`V${end[1] + height}`,
			`C${c3[0]},${c3[1]} ${c4[0]},${c4[1]} ${start[0]},${start[1] + height}`,
			`Z`
		].join(' ');

		return result;
	}, [waveData]);
	
	return <path
		ref={pathRef}
		style={{
			transformOrigin
		}}
		d={d}
		fill={color}
	/>
}

