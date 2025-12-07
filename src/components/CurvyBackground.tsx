import React, { useCallback, useEffect, useMemo, useRef } from 'react';

const COLOR_1 = "#CD8285";
const COLOR_2 = "#C14912";

const SCROLL_V_AMPLITUDE=0.2
const SCROLL_H_AMPLITUDE=0.14;

const ROTATION_AMPLITUDE=3;

const WAVE_COUNT = 8;

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 1024;


type GenerateWavesProps = {
  cw: number;
  ch: number;
  count: number;
}

function generateWavePathes(props: GenerateWavesProps) {
  const { cw, ch, count } = props;
  return Array.from({ length: count }, (_, i) => ({
    d: `M-200,${100 + i * 120} C100,50 400,150 720,${100 + i * 120} S1300,50 1640,${100 + i * 120} V1024 H-200 Z`
  }));
}

type GenerateWavePathProps = {
  y0: number;
  width: number;
  height: number;
}

function generateWavePath(props: GenerateWavePathProps) {
  const { y0, width, height } = props;

  return ``;
}


export default function CurvyBackground() {
	const containerRef = useRef<HTMLDivElement>(null);
	const pathsRef = useRef<(SVGPathElement | null)[]>([]);

  const updateBackground = useCallback(() => {
    const scroll = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio = docHeight > 0 ? scroll / docHeight : 0;
    

    if (containerRef.current) {
      const verticalOffset = scrollRatio * SCROLL_V_AMPLITUDE * window.innerHeight;
      const horizontalOffset = 0//-SCROLL_H_AMPLITUDE * window.innerWidth / 2;
      containerRef.current.style.transform = `translate3d(${horizontalOffset}px, ${verticalOffset}px, 0)`;
    }
    
    pathsRef.current.forEach((path, i) => {
      if (path) {
        const rotation = (i % 4 < 2 ? 1 : -1) * (1 - scrollRatio) * ROTATION_AMPLITUDE / 2;
        const translateX = (i % 2 === 0 ? -1 : 1) * (SCROLL_H_AMPLITUDE * window.innerWidth / 2);
        path.style.transform = `translate3d(${translateX}px, 0, 0) rotate(${rotation}deg)`;
      }
    });
  }, []);

  
	useEffect(() => {
    updateBackground();
		const handleScroll = () => {
      updateBackground();
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);



	const waves = useMemo(() => [
		{ d: "M-200,100 C100,50 400,150 720,100 S1300,50 1640,100 V1024 H-200 Z" },
		{ d: "M-200,220 C150,250 450,180 720,220 S1250,260 1640,220 V1024 H-200 Z" },
		{ d: "M-200,340 C100,300 400,400 720,340 S1300,300 1640,340 V1024 H-200 Z" },
		{ d: "M-200,460 C200,500 500,420 720,460 S1200,500 1640,460 V1024 H-200 Z" },
		{ d: "M-200,580 C150,540 450,620 720,580 S1350,540 1640,580 V1024 H-200 Z" },
		{ d: "M-200,700 C100,750 400,650 720,700 S1300,750 1640,700 V1024 H-200 Z" },
		{ d: "M-200,820 C200,780 500,860 720,820 S1250,780 1640,820 V1024 H-200 Z" },
		{ d: "M-200,940 C150,980 450,900 720,940 S1300,980 1640,940 V1024 H-200 Z" },
	], []);

  const waves2 = useMemo(() => Array.from({ length: WAVE_COUNT }, (_, i) => ({
    d: `M-200,${100 + i * 120} C100,50 400,150 720,${100 + i * 120} S1300,50 1640,${100 + i * 120} V1024 H-200 Z`
  })), []);

	return (
		<div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="w-full h-full absolute left-0" style={{
        transform: `scale(${Math.max(1 + SCROLL_V_AMPLITUDE, 1 + SCROLL_H_AMPLITUDE)})`,
        backgroundColor: COLOR_1
      }}>
        <div ref={containerRef} className="w-full h-full absolute left-0">
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            {waves.map((wave, i) => (
              <path
                style={{
                  transformOrigin: `${((i % 4) + 1) * 20}% 50%`
                }}
                key={i}
                ref={el => { pathsRef.current[i] = el; }}
                d={wave.d}
                fill={i % 2 === 0 ? COLOR_1 : COLOR_2}
              />
            ))}
          </svg>
        </div>
      </div>
		</div>
	);
}
