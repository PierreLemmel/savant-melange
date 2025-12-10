import { useEffect, useRef } from "react";
import { cn, inverseLerp, lerp } from "../lib/utils";

export interface PopingPortraitProps {
    name: string;
    offset: number;
}

const animValues = {
    scale: {
        from: 0.3,
        to: 1,
        startThreshold: 0,
        stopThreshold: 0.2,
        delta: 0.1
    },
}

export default function PopingPortrait(props: PopingPortraitProps) {
    const {
        name,
        offset
    } = props;
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const updateSize = () => {

            if (!imgRef.current) return;

            const {
                scale: {
                    from: scaleFrom,
                    to: scaleTo,
                    startThreshold: scaleStart,
                    stopThreshold: scaleStop,
                    delta: scaleDelta,
                }
            } = animValues;
            
            const top = imgRef.current.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            const progress = inverseLerp(windowHeight, 0, top);

            const scaleProgress = inverseLerp(
                scaleStart + offset * scaleDelta,
                scaleStop + offset * scaleDelta,
                progress,
                true
            );
            const scale = lerp(scaleFrom, scaleTo, scaleProgress);

            imgRef.current.style.transform = `scale(${scale})`;
        }
        updateSize();
        window.addEventListener('scroll', updateSize);
        window.addEventListener('resize', updateSize);
        return () => {
            window.removeEventListener('scroll', updateSize);
            window.removeEventListener('resize', updateSize);
        }
    }, [animValues, offset]);

    const isOdd = offset % 2 === 0;
    
    return <div className={cn(
        "w-full h-full",
        "origin-bottom",
        isOdd ? "animate-portrait-rotate" : "animate-portrait-rotate-reverse",
        isOdd ? "mt-6" : "mb-6",
    )}>
        <div ref={imgRef}
            className={cn(
                "w-full aspect-square",
                "origin-center",
                "bg-contain bg-bottom bg-no-repeat",
                "transition-transform duration-300 ease-in-out",
            )}
            style={{
                backgroundImage: `url(/img/portrait-${name}.png)`,
                filter: 'drop-shadow(10px 5px 1px var(--color-accent2))',
            }}
        />
    </div>
}