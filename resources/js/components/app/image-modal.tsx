import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

export default function ImageModal<ImgT extends { id: number; image: string }>({
    images,
    open,
    initialIndex,
    onClose,
}: {
    images: ImgT[];
    open: boolean;
    initialIndex: number;
    onClose: () => void;
}) {
    const [current, setCurrent] = useState<number>(initialIndex || 0);
    const [direction, setDirection] = useState<1 | -1>(1);
    React.useEffect(() => {
        if (open) setCurrent(initialIndex);
    }, [open, initialIndex]);
    if (!open || !images || images.length === 0) return null;
    const prev = () => {
        setDirection(-1);
        setCurrent((c: number) => (c === 0 ? images.length - 1 : c - 1));
    };
    const next = () => {
        setDirection(1);
        setCurrent((c: number) => (c === images.length - 1 ? 0 : c + 1));
    };
    // Portal target
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
            {images.length > 1 && (
                <>
                    <button
                        className="pointer-events-auto absolute top-1/2 left-0 z-[1010] -translate-y-1/2 rounded-full bg-white/80 p-3 text-gray-900 shadow-lg transition hover:bg-white disabled:opacity-50"
                        style={{ marginLeft: '24px' }}
                        onClick={prev}
                        aria-label="Previous image"
                    >
                        <ArrowLeft size={32} />
                    </button>
                    <button
                        className="pointer-events-auto absolute top-1/2 right-0 z-[1010] -translate-y-1/2 rounded-full bg-white/80 p-3 text-gray-900 shadow-lg transition hover:bg-white disabled:opacity-50"
                        style={{ marginRight: '24px' }}
                        onClick={next}
                        aria-label="Next image"
                    >
                        <ArrowRight size={32} />
                    </button>
                </>
            )}
            {/* Fullscreen Image with Animation */}
            <div className="flex h-auto max-h-[100vh] w-auto max-w-[100vw] items-center justify-center">
                <AnimatePresence custom={direction} initial={false} mode="wait">
                    <motion.img
                        key={images[current].image}
                        src={images[current].image}
                        alt="Project image"
                        className="h-auto max-h-[100vh] w-auto max-w-[100vw] rounded-lg object-contain shadow-2xl"
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
