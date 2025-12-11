import { useEffect, useRef } from "react";
import { cn, inverseLerp, lerp } from "../lib/utils";

export interface Partner {
    name: string;
    logo: string;
    url: string;
    moreWidth?: boolean;
    moreHeight?: boolean;
    addBackground?: boolean;
}

export interface PartnersIconsProps {
    partners: Partner[];
    className?: string;
}

const animValues = {
    scale: {
        from: 0.5,
        to: 1,
        startThreshold: 0,
        stopThreshold: 0.3,
        delta: 0.05
    },
};


export default function PartnersIcons(props: PartnersIconsProps) {
    const {
        partners,
        className,
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const updateSizes = () => {
            if (!containerRef.current) return;

            itemRefs.current.forEach((itemRef, index) => {
                if (!itemRef) return;

                const {
                    scale: {
                        from: scaleFrom,
                        to: scaleTo,
                        startThreshold: scaleStart,
                        stopThreshold: scaleStop,
                        delta: scaleDelta,
                    }
                } = animValues;
                const top = itemRef.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                const progress = inverseLerp(windowHeight, 0, top);

                const scaleProgress = inverseLerp(
                    scaleStart + index * scaleDelta,
                    scaleStop + index * scaleDelta,
                    progress,
                    true
                );
                const scale = lerp(scaleFrom, scaleTo, scaleProgress);

                itemRef.style.transform = `scale(${scale})`;
                itemRef.style.opacity = scaleProgress.toString();
            });
        };

        updateSizes();
        window.addEventListener('scroll', updateSizes);
        window.addEventListener('resize', updateSizes);
        
        return () => {
            window.removeEventListener('scroll', updateSizes);
            window.removeEventListener('resize', updateSizes);
        };
    }, [animValues]);

    if (partners.length === 0) {
        return null;
    }

    return <div
        ref={containerRef}
        className={cn(
            "w-full",
            "grid gap-6 md:gap-8",
            "grid-cols-2",
            "grid-rows-[repeat(auto-fill,1fr)]",
            className
        )}
    >
        {partners.map((partner, index) => {

            const {
                moreWidth = false,
                moreHeight = false,
                name,
                logo,
                url,
                addBackground = false,
            } = partner;

            return <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    "block hover:scale-110 transition-transform duration-300 ease-in-out",
                    "flex items-center justify-center",
                    moreWidth && "col-span-2",
                    moreHeight && "row-span-2",
                )}
            >
                <div className={cn(
                    "w-full",
                    moreWidth ? "max-w-96" : "max-w-64",
                    "px-4",
                    addBackground && "bg-white rounded-xl"
                )}
                style={{
                    filter: 'drop-shadow(5px 3px 2px rgba(0, 0, 0, 0.2))',
                }}>
                    <div
                        ref={(el) => {
                            itemRefs.current[index] = el;
                        }}
                        className={cn(
                            "w-full",
                            moreHeight ? "h-36" : "h-24",
                            "bg-contain bg-center bg-no-repeat",
                            "transition-all duration-300 ease-in-out",
                            "origin-center",
                            "flex items-center justify-center",
                        )}
                        style={{
                            backgroundImage: `url(/img/icons/logo-${logo}.png)`,
                        }}
                        aria-label={name}
                    />
                </div>
                
            </a>
        })}
    </div>
}