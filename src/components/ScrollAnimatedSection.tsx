import React, { useEffect, useRef, useState } from 'react';
import { cn, lerp, clamp, inverseLerp, isBetween } from '../lib/utils';

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
            startThreshold: 0.17,
            stopThreshold: 0.35,
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
            value: -25,
            startThreshold: 0.17,
            stopThreshold: 0.35,
        },
        atIntersect: 0,
        after: {
            value: 1.2,
            startThreshold: 0.5,
            stopThreshold: 0.9,
        },
    },
    opacity: {
        before: {
            value: 0,
            startThreshold: 0,
            stopThreshold: 0.5,
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

    if (isBetween(topProgress, before.startThreshold, before.stopThreshold)) {
        const beforeProgress = inverseLerp(before.startThreshold, before.stopThreshold, topProgress)
        return lerp(before.value, atIntersect, beforeProgress);
    }

    if (isBetween(bottomProgress, after.startThreshold, after.stopThreshold)) {
        const afterProgress = inverseLerp(after.startThreshold, after.stopThreshold, bottomProgress)
        return lerp(atIntersect, after.value, afterProgress);
    }
    
    if (bottomProgress > after.stopThreshold) {
        return after.value;
    }

    return atIntersect;
}

export default function ScrollAnimatedSection(props: ScrollAnimatedSectionProps) {

    const {
        children,
        className,
        id,
        leftToRight,
    } = props;

    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateTransform = () => {
            if (!contentRef.current || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementTop = containerRect.top;
            const elementBottom = containerRect.bottom;

            const topProgress = inverseLerp(windowHeight, 0, elementTop);
            const bottomProgress = inverseLerp(windowHeight, 0, elementBottom);

            const translate = getIntersectableValue(topProgress, bottomProgress, intersectableValues.translate) * (leftToRight ? -1 : 1);
            const rotation = getIntersectableValue(topProgress, bottomProgress, intersectableValues.rotation) * (leftToRight ? 1 : -1);
            const opacity = getIntersectableValue(topProgress, bottomProgress, intersectableValues.opacity);

            contentRef.current.style.transform = `translateX(${translate}vw) rotate(${rotation}deg)`;
            contentRef.current.style.opacity = opacity.toString();

            containerRef.current.style.height = `${contentRef.current.getBoundingClientRect().height}px`;
        };

        updateTransform();
        window.addEventListener('scroll', updateTransform, { passive: true });
        window.addEventListener('resize', updateTransform, { passive: true });

        return () => {
            window.removeEventListener('scroll', updateTransform);
            window.removeEventListener('resize', updateTransform);
        };
    }, [intersectableValues, leftToRight]);

    return <div
        id={id}
        ref={containerRef}
        className={cn(
            "relative w-full",
            "will-change-transform",
            leftToRight ? "origin-top-left" : "origin-top-right",
            className
        )}
    >
        <div
            className="absolute w-full"
            ref={contentRef}
        >
            {children}
        </div>
    </div>
}
