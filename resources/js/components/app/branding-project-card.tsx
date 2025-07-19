import { BrandingProjectT } from '@/types';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface BrandingProjectCardProps {
    project: BrandingProjectT;
    className?: string;
}

export default function BrandingProjectCard({ project, className = '' }: BrandingProjectCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const images = project.images || [];

    // Find primary image and put it first
    const sortedImages = [...images].sort((a, b) => {
        if (a.is_primary) return -1;
        if (b.is_primary) return 1;
        return a.order - b.order;
    });

    // Preload images for smoother transitions
    useEffect(() => {
        if (!sortedImages.length) return;

        const loadPromises = sortedImages.map((image, idx) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    setImagesLoaded((prev) => {
                        const newLoaded = [...prev];
                        newLoaded[idx] = true;
                        return newLoaded;
                    });
                    resolve();
                };
                img.onerror = () => resolve();
                img.src = image.image || '/assets/placeholder.png';
            });
        });

        Promise.all(loadPromises);
    }, [sortedImages]);

    // Original animation timing with performance optimizations
    const startAnimation = useCallback(() => {
        if (sortedImages.length <= 1) return;

        intervalRef.current = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length);
        }, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [sortedImages.length]);

    useEffect(() => {
        const cleanup = startAnimation();
        return cleanup;
    }, [startAnimation]);

    // Handle card click to navigate to detail page
    const handleCardClick = () => {
        router.visit(route('branding-projects.detail', project.id));
    };

    if (!sortedImages.length) return null;

    return (
        <div
            className={`group relative cursor-pointer overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl ${className}`}
            onClick={handleCardClick}
        >
            {/* Image carousel with original scroll-up animation but optimized */}
            <div
                className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100"
                style={{
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                }}
            >
                <AnimatePresence initial={false}>
                    <motion.img
                        key={currentImageIndex}
                        src={sortedImages[currentImageIndex]?.image || '/assets/placeholder.png'}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{
                            willChange: 'transform',
                            backfaceVisibility: 'hidden',
                        }}
                        initial={{ y: '100%', opacity: 1 }}
                        animate={{
                            y: 0,
                            opacity: imagesLoaded[currentImageIndex] ? 1 : 0,
                        }}
                        exit={{ y: '-100%', opacity: 1 }}
                        transition={{
                            duration: 0.7,
                            ease: [0.4, 0, 0.2, 1], // Smooth easing
                            opacity: { duration: 0.2 },
                        }}
                        loading="lazy"
                        decoding="async"
                    />
                </AnimatePresence>

                {/* Loading indicator */}
                {!imagesLoaded[currentImageIndex] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                    </div>
                )}
            </div>

            {/* Project info overlay */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
                <h3 className="translate-y-2 transform text-lg font-bold text-white transition-transform duration-300 group-hover:translate-y-0">
                    {project.title}
                </h3>
                <p className="mb-1 translate-y-2 transform text-sm text-white/80 transition-transform delay-75 duration-300 group-hover:translate-y-0">
                    {project.client_company}
                </p>
                {project.client_origin && (
                    <div className="mb-2 flex translate-y-2 transform items-center gap-1 text-xs text-white/70 transition-transform delay-100 duration-300 group-hover:translate-y-0">
                        <MapPin size={12} />
                        <span>{project.client_origin}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
