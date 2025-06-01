import { BusinessProcessT } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import BusinessProcessItem from './business-process-item';
import SectionHeader from './section-header';

export default function BusinessProcessSection() {
    const { businessProcesses } = usePage<{ businessProcesses: BusinessProcessT[] }>().props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Animation variants for slides
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    // Animation variants for navigation buttons
    const navButtonVariants = {
        initial: { scale: 0.9, opacity: 0.7 },
        hover: { scale: 1.1, opacity: 1 },
        tap: { scale: 0.95 },
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = businessProcesses.length - 1;
            if (nextIndex >= businessProcesses.length) nextIndex = 0;
            return nextIndex;
        });
    };

    if (!businessProcesses || businessProcesses.length === 0) return null;

    const currentBusinessProcess = businessProcesses[currentIndex];

    return (
        <section id="work" className="relative bg-gradient-to-b from-white to-gray-50 py-16 dark:from-gray-900 dark:to-gray-950">
            {/* Background decorative elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
                <div className="bg-primary/20 absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
            </div>

            <div className="app-container mb-8 md:mb-10">
                <SectionHeader
                    header="Our Creative process"
                    description="Follow our proven step-by-step approach to transform your ideas into reality"
                />
            </div>

            <div className="relative min-h-[60vh]">
                {/* Navigation Buttons */}
                <div className="absolute top-1/2 right-4 left-4 z-20 flex -translate-y-1/2 justify-between">
                    <motion.button
                        onClick={() => paginate(-1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg md:h-12 md:w-12"
                        variants={navButtonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Previous step"
                    >
                        <ChevronLeft size={24} />
                    </motion.button>
                    <motion.button
                        onClick={() => paginate(1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg md:h-12 md:w-12"
                        variants={navButtonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Next step"
                    >
                        <ChevronRight size={24} />
                    </motion.button>
                </div>

                {/* Process Items */}
                <div className="app-container">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentBusinessProcess.id}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 },
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(_, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);
                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1);
                                }
                            }}
                            className="flex items-center justify-center py-8"
                        >
                            <BusinessProcessItem
                                businessProcess={currentBusinessProcess}
                                isActive={true}
                                index={currentIndex}
                                totalItems={businessProcesses.length}
                                scrollDirection="down"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination Bars */}
                <div className="mt-8 flex items-center justify-center gap-2">
                    {businessProcesses.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => {
                                const direction = index > currentIndex ? 1 : -1;
                                setDirection(direction);
                                setCurrentIndex(index);
                            }}
                            className={`h-[3px] w-12 transition-all duration-300 ${currentIndex === index ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'}`}
                            aria-label={`Go to step ${index + 1}`}
                            whileHover={{ scaleY: 1.5 }}
                            whileTap={{ scale: 0.95 }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
