import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../lib/utils';

export interface PhotoCarousselProps {
    images: string[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showIndicators?: boolean;
    showNavigation?: boolean;
    className?: string;
    ratio?: string;
}

export default function PhotoCaroussel({
    images,
    autoPlay = false,
    autoPlayInterval = 5000,
    showIndicators = true,
    showNavigation = true,
    className,
    ratio = "4/3"
}: PhotoCarousselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const goToSlide = useCallback((index: number) => {
        if (index === currentIndex || isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 300);
    }, [currentIndex, isTransitioning]);

    const goToPrevious = useCallback(() => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        goToSlide(newIndex);
    }, [currentIndex, images.length, goToSlide]);

    const goToNext = useCallback(() => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        goToSlide(newIndex);
    }, [currentIndex, images.length, goToSlide]);

    useEffect(() => {
        if (!autoPlay) return;

        const interval = setInterval(() => {
            goToNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, goToNext]);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        }
        if (isRightSwipe) {
            goToPrevious();
        }
    };

    if (images.length === 0) {
        return null;
    }

    return <div className={cn(
            "relative",
            "w-full",
            className
        )}
    >
        <div
            className={cn(
                "relative w-full overflow-hidden rounded-2xl"
            )}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
                filter: 'drop-shadow(10px 5px 1px var(--color-accent2))',
            }}
        >
            <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    aspectRatio: ratio,
                }}
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={cn(
                            "min-w-full shrink-0",
                            "bg-cover bg-center bg-no-repeat"
                        )}
                        style={{
                            backgroundImage: `url(${image})`,
                        }}
                    >
                        {/* <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-auto object-cover"
                        /> */}
                    </div>
                ))}
            </div>

            {showNavigation && images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2",
                            "bg-accent1/80 hover:bg-accent1",
                            "text-white p-2 rounded-full",
                            "transition-all duration-200",
                            "hover:scale-110",
                            "focus:outline-none focus:ring-2 focus:ring-accent1 focus:ring-offset-2",
                            "z-10"
                        )}
                        aria-label="Previous image"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={goToNext}
                        className={cn(
                            "absolute right-4 top-1/2 -translate-y-1/2",
                            "bg-accent1/80 hover:bg-accent1",
                            "text-white p-2 rounded-full",
                            "transition-all duration-200",
                            "hover:scale-110",
                            "focus:outline-none focus:ring-2 focus:ring-accent1 focus:ring-offset-2",
                            "z-10"
                        )}
                        aria-label="Next image"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </>
            )}
        </div>

        {showIndicators && images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "w-3 h-3 rounded-full transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-accent1 focus:ring-offset-2",
                            currentIndex === index
                                ? "bg-accent1 scale-125"
                                : "bg-accent1/40 hover:bg-accent1/60"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        )}
    </div>
}

