import { cn } from '@/lib/utils';
import { MascortArtT } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import ImageModal from './image-modal';

export default function MascotCarouselSection() {
    const { mascotArts } = usePage<{ mascotArts: MascortArtT[] }>().props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
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

    const paginate = useCallback(
        (newDirection: number) => {
            setDirection(newDirection);
            setCurrentIndex((prevIndex) => {
                let nextIndex = prevIndex + newDirection;
                if (nextIndex < 0) nextIndex = mascotArts.length - 1;
                if (nextIndex >= mascotArts.length) nextIndex = 0;
                return nextIndex;
            });
        },
        [mascotArts.length],
    );

    if (!mascotArts || mascotArts?.length === 0) return null;

    const currentMascotArt = mascotArts[currentIndex];
    // Only non-mascot images for modal
    const nonMascotImages = currentMascotArt.images.filter((img) => !img.is_mascot);

    return (
        <div className="relative py-32">
            {mascotArts.length > 1 && (
                <div className="absolute top-1/2 right-4 left-4 z-20 flex -translate-y-1/2 justify-between">
                    <motion.button
                        onClick={() => paginate(-1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg md:h-12 md:w-12"
                        variants={navButtonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Previous slide"
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
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </motion.button>
                </div>
            )}

            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={currentMascotArt.id}
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
                    className="app-container"
                >
                    <div className="flex flex-col gap-8">
                        <motion.div
                            className="space-y-3 lg:max-w-[45%]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <h1 className="text-3xl font-bold sm:text-4xl">{currentMascotArt?.title}</h1>
                            <p className="leading-[1.7]">{currentMascotArt?.description}</p>
                        </motion.div>
                        <div className="grid w-full grid-cols-1 gap-5 py-11 lg:grid-cols-4">
                            {currentMascotArt?.images?.map((image, idx) =>
                                !image?.is_mascot ? (
                                    <motion.img
                                        key={image.id}
                                        src={image?.image}
                                        alt={'mascot-image' + image.id}
                                        className={cn(
                                            'col-span-2 h-[250px] w-full rounded-xl object-cover object-center sm:h-[300px] md:col-span-1 lg:h-[350px] lg:object-top',
                                            image?.is_primary && '!col-span-2',
                                        )}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        whileHover={{ scale: 1.03 }}
                                        onClick={() => {
                                            setModalIndex(idx);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                ) : (
                                    <motion.img
                                        key={image.id}
                                        className="absolute top-[-20%] right-0 z-10 hidden max-w-full sm:block lg:max-w-[800px]"
                                        src={image?.image}
                                        alt="main-mascot"
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.9, duration: 0.7, type: 'spring' }}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Bars */}
            {mascotArts.length > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                    {mascotArts.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => {
                                const direction = index > currentIndex ? 1 : -1;
                                setDirection(direction);
                                setCurrentIndex(index);
                            }}
                            className={cn('h-[3px] w-12 transition-all duration-300', currentIndex === index ? 'bg-black' : 'bg-gray-300')}
                            aria-label={`Go to slide ${index + 1}`}
                            whileHover={{ scaleY: 1.5 }}
                            whileTap={{ scale: 0.95 }}
                        />
                    ))}
                </div>
            )}
            <ImageModal images={nonMascotImages} open={isModalOpen} initialIndex={modalIndex} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
