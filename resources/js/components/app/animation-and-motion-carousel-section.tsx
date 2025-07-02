import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { AnimationAndMotionImageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, Play } from 'lucide-react';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function VideoModal({
    videos,
    open,
    initialIndex,
    onClose,
}: {
    videos: AnimationAndMotionImageT[];
    open: boolean;
    initialIndex: number;
    onClose: () => void;
}) {
    const [current, setCurrent] = useState<number>(initialIndex || 0);
    const [direction, setDirection] = useState<1 | -1>(1);
    React.useEffect(() => {
        if (open) setCurrent(initialIndex);
    }, [open, initialIndex]);
    if (!open || !videos || videos.length === 0) return null;
    const prev = () => {
        setDirection(-1);
        setCurrent((c: number) => (c === 0 ? videos.length - 1 : c - 1));
    };
    const next = () => {
        setDirection(1);
        setCurrent((c: number) => (c === videos.length - 1 ? 0 : c + 1));
    };
    const modalRoot = typeof window !== 'undefined' ? document.body : null;
    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? '20vw' : '-20vw',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? '-20vw' : '20vw',
            opacity: 0,
        }),
    };
    const modalContent = (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.92)' }}>
            {/* Close Button */}
            <button
                className="absolute top-6 right-8 z-[1010] rounded-full bg-black/40 p-2 text-white transition hover:bg-black/70"
                onClick={onClose}
                aria-label="Close"
            >
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
            {/* Navigation Arrows */}
            {videos.length > 1 && (
                <>
                    <button
                        className="pointer-events-auto absolute top-1/2 left-0 z-[1010] -translate-y-1/2 rounded-full bg-white/80 p-3 text-gray-900 shadow-lg transition hover:bg-white disabled:opacity-50"
                        style={{ marginLeft: '24px' }}
                        onClick={prev}
                        aria-label="Previous video"
                    >
                        <ChevronsLeft size={32} />
                    </button>
                    <button
                        className="pointer-events-auto absolute top-1/2 right-0 z-[1010] -translate-y-1/2 rounded-full bg-white/80 p-3 text-gray-900 shadow-lg transition hover:bg-white disabled:opacity-50"
                        style={{ marginRight: '24px' }}
                        onClick={next}
                        aria-label="Next video"
                    >
                        <ChevronsRight size={32} />
                    </button>
                </>
            )}
            {/* Fullscreen Video with Animation */}
            <div className="flex h-auto max-h-[100vh] w-auto max-w-[100vw] items-center justify-center">
                <AnimatePresence custom={direction} initial={false} mode="wait">
                    <motion.video
                        key={videos[current].image}
                        src={videos[current].image}
                        controls
                        autoPlay
                        className="h-auto max-h-[90vh] w-auto max-w-[90vw] rounded-lg bg-black object-contain shadow-2xl"
                        style={{ boxShadow: '0 8px 40px 0 rgba(0,0,0,0.7)' }}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    />
                </AnimatePresence>
            </div>
        </div>
    );
    return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null;
}

export default function AnimationAndMotionCarouselSection() {
    const { animationAndMotionsVideos } = usePage<{ animationAndMotionsVideos: AnimationAndMotionImageT[] }>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [api, setApi] = useState<CarouselApi>();

    const handleOpenModal = (idx: number) => {
        setModalIndex(idx);
        setIsModalOpen(true);
    };

    const handleNext = () => {
        api?.scrollNext();
    };

    const handlePrevious = () => {
        api?.scrollPrev();
    };

    if (!animationAndMotionsVideos || animationAndMotionsVideos.length === 0) return null;

    return (
        <div className="py-8">
            <Carousel
                opts={{
                    align: 'center',
                }}
                setApi={setApi}
                className="app-container"
            >
                <CarouselContent>
                    {animationAndMotionsVideos.map((image, index) => (
                        <CarouselItem key={index} className="w-full md:basis-2/3">
                            <div key={`sticker-${index}`} className="group relative mx-2 my-2 overflow-hidden rounded-2xl">
                                <video
                                    onClick={() => handleOpenModal(index)}
                                    className="cursor-pointer rounded-2xl object-cover object-center shadow transition-transform duration-500 hover:scale-[1.2]"
                                    src={image.image}
                                />
                                <div className="absolute top-1/2 left-1/2 z-5 flex size-[80px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/60 transition-all duration-500 group-hover:border-white">
                                    <Play className="size-[3em] text-white/60 transition-all duration-500 group-hover:text-white" />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {animationAndMotionsVideos.length > 1 && (
                    <div className="my-3 hidden gap-5 select-none md:flex md:items-center md:justify-center">
                        <div
                            onClick={handlePrevious}
                            className="group flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm tracking-wide uppercase transition-all duration-500 hover:border-black"
                        >
                            <ChevronsLeft className="size-5 text-gray-500 transition-all duration-500 group-hover:text-black" />
                            <span>Previous</span>
                        </div>
                        <div
                            onClick={handleNext}
                            className="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm tracking-wide uppercase transition-all duration-500 hover:border-black"
                        >
                            <span>Next</span>
                            <ChevronsRight className="size-5 text-gray-500 transition-all duration-500 group-hover:text-black" />
                        </div>
                    </div>
                )}
            </Carousel>

            <VideoModal videos={animationAndMotionsVideos} open={isModalOpen} initialIndex={modalIndex} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
