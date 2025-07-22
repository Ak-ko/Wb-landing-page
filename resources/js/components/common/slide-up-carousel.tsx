import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface SlideUpCarouselProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    interval?: number;
    animationDuration?: number;
    containerHeight?: number;
    containerPadding?: number;
    containerClass?: string;
    onItemClick?: (item: T, index: number) => void;
    autoPlay?: boolean;
}

export default function SlideUpCarousel<T>({
    items,
    renderItem,
    interval = 4000,
    animationDuration = 0.8,
    containerHeight = 420,
    containerPadding = 50,
    containerClass = '',
    onItemClick,
    autoPlay = true,
}: SlideUpCarouselProps<T>) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Start the interval
    const startInterval = () => {
        if (intervalRef.current || !autoPlay) return;

        intervalRef.current = setInterval(() => {
            if (items?.length > 1) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
            }
        }, interval);
    };

    // Clear the interval
    const clearInterval = () => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        startInterval();
        return () => clearInterval();
    }, [items?.length, autoPlay]);

    if (!items || items.length === 0) {
        return null;
    }

    // Animation variants for the slide up effect
    const slideVariants = {
        enter: {
            y: containerHeight * 0.8,
            opacity: 0,
        },
        center: {
            y: 0,
            opacity: 1,
            transition: {
                duration: animationDuration,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
        exit: {
            y: -containerHeight * 0.8,
            opacity: 0,
            transition: {
                duration: animationDuration,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    return (
        <div className={`relative ${containerClass}`}>
            <div
                className="relative overflow-hidden"
                style={{
                    height: `${containerHeight}px`,
                    paddingTop: `${containerPadding}px`,
                    paddingBottom: `${containerPadding}px`,
                }}
            >
                <div className="relative flex items-center justify-center" style={{ height: `${containerHeight - containerPadding * 2}px` }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 flex items-center justify-center"
                            onClick={() => onItemClick?.(items[currentIndex], currentIndex)}
                        >
                            {renderItem(items[currentIndex], currentIndex)}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Export ref interface for advanced control
export interface SlideUpCarouselRef {
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    currentIndex: number;
}
