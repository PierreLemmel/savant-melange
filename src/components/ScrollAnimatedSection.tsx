import React, { useEffect, useRef, useState } from 'react';
import { cn, lerp, clamp, inverseLerp } from '../lib/utils';

type IntersectValue = {
    before: {
        value: number;
        startThreshold: number;
        stopThreshold: number;
    };
    atIntersect: number;
    after: {
        value: number;
        startThreshold: number;
        stopThreshold: number;
    };
}

interface ScrollAnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    leftToRight: boolean;
}

const intersectableValues: Record<string, IntersectValue> = {
    translate: {
        before: {
            value: 100,
            startThreshold: 0.2,
            stopThreshold: 0.4,
        },
        atIntersect: 0,
        after: {
            value: 0,
            startThreshold: 0.6,
            stopThreshold: 1,
        },
    },
    rotation: {
        before: {
            value: -10,
            startThreshold: 0.2,
            stopThreshold: 0.4,
        },
        atIntersect: 0,
        after: {
            value: 1.2,
            startThreshold: 0.6,
            stopThreshold: 0.8,
        },
    },
    opacity: {
        before: {
            value: 0.3,
            startThreshold: 0.2,
            stopThreshold: 0.4,
        },
        atIntersect: 1,
        after: {
            value: 0.3,
            startThreshold: 0.7,
            stopThreshold: 0.9,
        },
    },
}

function getIntersectableValue(topProgress: number, bottomProgress: number, intersectableValue: IntersectValue) {
    
    const {
        before,
        atIntersect,
        after,
    } = intersectableValue;
    if (topProgress < before.startThreshold) {
        return before.value;
    }
    else if (topProgress < before.stopThreshold) {
        const beforeProgress = inverseLerp(before.startThreshold, before.stopThreshold, topProgress)
        return lerp(before.value, atIntersect, beforeProgress);
    }
    else if (bottomProgress > after.stopThreshold) {
        return after.value;
    }
    else if (bottomProgress > after.startThreshold) {
        const afterProgress = inverseLerp(after.startThreshold, after.stopThreshold, bottomProgress)
        return lerp(atIntersect, after.value, afterProgress);
    }
    else {
        return atIntersect;
    }
}

export default function ScrollAnimatedSection(props: ScrollAnimatedSectionProps) {

    const {
        children,
        className,
        id,
        leftToRight,
    } = props;

    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const updateTransform = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementTop = rect.top;
            const elementBottom = rect.bottom;

            const topProgress = inverseLerp(windowHeight, 0, elementTop);
            const bottomProgress = inverseLerp(windowHeight, 0, elementBottom);


            const translate = getIntersectableValue(topProgress, bottomProgress, intersectableValues.translate) * (leftToRight ? -1 : 1);
            const rotation = getIntersectableValue(topProgress, bottomProgress, intersectableValues.rotation) * (leftToRight ? 1 : -1);
            const opacity = getIntersectableValue(topProgress, bottomProgress, intersectableValues.opacity);

            sectionRef.current.style.transform = `translateX(${translate}vw) rotate(${rotation}deg)`;
            sectionRef.current.style.opacity = opacity.toString();
        };

        updateTransform();
        window.addEventListener('scroll', updateTransform, { passive: true });
        window.addEventListener('resize', updateTransform, { passive: true });

        return () => {
            window.removeEventListener('scroll', updateTransform);
            window.removeEventListener('resize', updateTransform);
        };
    }, [intersectableValues, leftToRight]);

    return <section
        ref={sectionRef}
        id={id}
        className={cn(
            "will-change-transform",
            leftToRight ? "origin-left" : "origin-right",
            className
        )}
    >
        {children}
    </section>
}
