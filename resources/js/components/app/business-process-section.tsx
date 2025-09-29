import { useIsMobile } from '@/hooks/use-mobile';
import { BusinessProcessT } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import BusinessProcessItem from './business-process-item';
import FlagIcon from './icons/flag-icon';
import SectionHeader from './section-header';

export default function BusinessProcessSection() {
    const { businessProcesses } = usePage<{ businessProcesses: BusinessProcessT[] }>().props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const isMobile = useIsMobile();

    // Animation variants for slides
    const slideVariants = {
        enter: (direction: number) => ({
            x: !isMobile ? (direction > 0 ? 50 : -50) : 0,
            y: isMobile ? (direction > 0 ? 50 : -50) : 0,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            y: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: !isMobile ? (direction < 0 ? 50 : -50) : 0,
            y: isMobile ? (direction < 0 ? 50 : -50) : 0,
            opacity: 0,
        }),
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
        <section id="work" className="relative bg-gradient-to-b from-white to-gray-50 py-32 dark:from-gray-900 dark:to-gray-950">
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

            <div className="relative">
                <div className="app-container relative">
                    {isMobile && (
                        <div className="absolute top-0 left-4 z-10 flex h-full flex-col items-center py-8">
                            <div className="relative flex flex-col items-center">
                                <div className="absolute top-4 left-1/2 h-full w-1 -translate-x-1/2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                                {/* Progress Line */}
                                <motion.div
                                    className="absolute top-4 left-1/2 w-1 -translate-x-1/2 rounded-full"
                                    style={{
                                        backgroundColor: currentBusinessProcess.color_tag,
                                        height: `${(currentIndex / Math.max(businessProcesses.length - 1, 1)) * 560}px`,
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{
                                        height: `${(currentIndex / Math.max(businessProcesses.length - 1, 1)) * 560}px`,
                                    }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                ></motion.div>

                                {/* Steps */}
                                {businessProcesses.map((process, index) => (
                                    <motion.button
                                        key={process.id}
                                        onClick={() => {
                                            const direction = index > currentIndex ? 1 : -1;
                                            setDirection(direction);
                                            setCurrentIndex(index);
                                        }}
                                        className="relative mb-8 flex cursor-pointer items-center"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={`Go to step ${index + 1}`}
                                    >
                                        <motion.div
                                            className={`relative h-6 w-6 rounded-full border-4 transition-all duration-300 ${
                                                index <= currentIndex ? 'shadow-lg' : ''
                                            }`}
                                            style={{
                                                borderColor: index <= currentIndex ? currentBusinessProcess.color_tag : '#d1d5db',
                                                backgroundColor: 'white',
                                            }}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                        ></motion.div>
                                    </motion.button>
                                ))}

                                <motion.div
                                    className="absolute -bottom-11 flex items-center"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: businessProcesses.length * 0.1 }}
                                >
                                    <FlagIcon
                                        className="h-6 w-6"
                                        style={{
                                            fill: currentBusinessProcess.color_tag,
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    )}

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
                                y: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 },
                            }}
                            drag={isMobile ? 'y' : 'x'}
                            dragConstraints={isMobile ? { top: 0, bottom: 0 } : { left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(_, { offset, velocity }) => {
                                const swipe = isMobile ? swipePower(offset.y, velocity.y) : swipePower(offset.x, velocity.x);

                                if (isMobile) {
                                    if (swipe < -swipeConfidenceThreshold) {
                                        paginate(1);
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        paginate(-1);
                                    }
                                } else {
                                    if (swipe < -swipeConfidenceThreshold) {
                                        paginate(1);
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        paginate(-1);
                                    }
                                }
                            }}
                            className={isMobile ? 'flex items-center justify-center py-8 pl-12' : 'flex items-center justify-center py-8'}
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

                {/* Mobile Navigation Buttons */}
                {isMobile && (
                    <div className="app-container mt-8 ml-5">
                        <div className="flex justify-center gap-4">
                            <motion.button
                                onClick={() => paginate(-1)}
                                className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200"
                                style={{ backgroundColor: currentBusinessProcess.color_tag }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={currentIndex === 0}
                            >
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            </motion.button>

                            <motion.button
                                onClick={() => paginate(1)}
                                className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200"
                                style={{ backgroundColor: currentBusinessProcess.color_tag }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={currentIndex === businessProcesses.length - 1}
                            >
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </motion.button>
                        </div>
                    </div>
                )}

                {/* Desktop Progress Bar */}
                {!isMobile && (
                    <div className="app-container mt-12">
                        <div className="relative mx-auto flex max-w-[1200px] items-center">
                            <div className="absolute top-1/2 right-0 left-0 h-[11px] -translate-y-1/2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                            <div className="invisible w-[30px] opacity-0">
                                data {Math.round((currentIndex / (businessProcesses.length - 1)) * 100)}
                            </div>
                            <motion.div
                                className="absolute top-1/2 left-0 h-[11px] -translate-y-1/2 rounded-full"
                                style={{
                                    backgroundColor: currentBusinessProcess.color_tag,
                                    width:
                                        currentIndex === 0
                                            ? 34
                                            : currentIndex === businessProcesses?.length - 1
                                              ? `${Math.round((currentIndex / (businessProcesses.length - 1)) * 100)}%`
                                              : `${Math.round((currentIndex / (businessProcesses.length - 1)) * 100) - currentIndex + 3}%`,
                                }}
                                initial={{ width: 0 }}
                                animate={{
                                    width:
                                        currentIndex === 0
                                            ? 34
                                            : currentIndex === businessProcesses?.length - 1
                                              ? `${Math.round((currentIndex / (businessProcesses.length - 1)) * 100)}%`
                                              : `${Math.round((currentIndex / (businessProcesses.length - 1)) * 100 - currentIndex + 3)}%`,
                                }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            ></motion.div>
                            {/* Steps */}
                            <div className="relative mt-6 flex w-full justify-between">
                                {businessProcesses.map((process, index) => (
                                    <motion.button
                                        key={process.id}
                                        onClick={() => {
                                            const direction = index > currentIndex ? 1 : -1;
                                            setDirection(direction);
                                            setCurrentIndex(index);
                                        }}
                                        className="relative flex cursor-pointer flex-col items-center"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={`Go to step ${index + 1}`}
                                    >
                                        {/* Step Circle */}
                                        <motion.div
                                            className={`relative size-9 rounded-full border-4 transition-all duration-300 md:h-13 md:w-13 md:border-[9px] ${
                                                index <= currentIndex ? 'shadow-lg' : ''
                                            }`}
                                            style={{
                                                borderColor: index <= currentIndex ? currentBusinessProcess.color_tag : '#d1d5db',
                                                backgroundColor: 'white',
                                            }}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                        ></motion.div>

                                        {/* Step Label */}
                                        <motion.span
                                            className={`mt-3 text-xs font-medium md:text-sm ${
                                                index <= currentIndex ? 'font-bold' : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                            style={{
                                                color: index <= currentIndex ? currentBusinessProcess.color_tag : undefined,
                                            }}
                                        >
                                            STEP {index + 1}
                                        </motion.span>
                                    </motion.button>
                                ))}
                            </div>
                            <div className="invisible w-[30px] opacity-0">
                                data {Math.round((currentIndex / (businessProcesses.length - 1)) * 100)}
                            </div>
                            {/* Flag Icon at the rightmost end */}
                            <motion.div
                                className="absolute top-1 -right-3 flex items-center"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: businessProcesses.length * 0.1 }}
                            >
                                <FlagIcon
                                    className="h-8 w-8 md:h-10 md:w-10"
                                    style={{
                                        fill: currentBusinessProcess.color_tag,
                                    }}
                                />
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
