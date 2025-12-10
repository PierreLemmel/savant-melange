import { useEffect, useMemo, useRef } from "react";
import { clamp, cn, inverseLerp, lerp } from "../lib/utils";

const animValues = {
    scale: {
        from: 1,
        to: 0.65,
        startThreshold: 0.85,
        stopThreshold: 1.15,
    },
    opacity: {
        from: 1,
        to: 0,
        startThreshold: 0.75,
        stopThreshold: 0.95,
    }
}

export default function InitialBanneer() {
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateTransform = () => {
            if (!contentRef.current || !containerRef.current) return;

            const {
                scale: {
                    startThreshold: scaleStart,
                    stopThreshold: scaleStop,
                    from: scaleFrom,
                    to: scaleTo,
                },
                opacity: {
                    startThreshold: opacityStart,
                    stopThreshold: opacityStop,
                    from: opacityFrom,
                    to: opacityTo,
                }
            } = animValues;

            const containerRect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const center = containerRect.y + containerRect.height / 2;

            const screenProgress = inverseLerp(windowHeight, 0, center);
            const scaleProgress = inverseLerp(scaleStart, scaleStop, screenProgress, true);
            const opacityProgress = inverseLerp(opacityStart, opacityStop, screenProgress, true);

            contentRef.current.style.opacity = (1 - opacityProgress).toString();
            contentRef.current.style.transform = `scale(${lerp(scaleFrom, scaleTo, scaleProgress)})`;
        };

        updateTransform();
        window.addEventListener('scroll', updateTransform, { passive: true });
        window.addEventListener('resize', updateTransform, { passive: true });

        return () => {
            window.removeEventListener('scroll', updateTransform);
            window.removeEventListener('resize', updateTransform);
        };
    }, [animValues]);
    
    return <section className={cn(
        "h-[82vh] pt-[20vh]"
    )} ref={containerRef}>
        <div ref={contentRef} className={cn(
            "w-full h-full", 
            "flex flex-col justify-center items-center",
            "transition-all duration-300 ease-in-out"
        )}>
            <h1 className={cn(
                "text-6xl md:text-8xl lg:text-8xl xl:text-[7.4rem] 2xl:text-[9.5rem]",
                "font-black uppercase tracking-tighter text-accent2 text-center",
                "-rotate-1"
            )}>
                Savant mélange
            </h1>
            <h2 className={cn(
                "text-2xl md:text-3xl xl:text-[2.5rem] 2xl:text-[3.5rem]",
                "font-bold p-4 text-center",
                "text-accent2",
                "rotate-1"
            )}>
                Quand sciences et impro se rencontrent
            </h2>
        </div>
    </section>
}