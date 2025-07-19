import { BrandingProjectT } from '@/types';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface BrandingProjectCardProps {
    project: BrandingProjectT;
    className?: string;
}

export default function BrandingProjectCard({ project, className = '' }: BrandingProjectCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const images = project.images || [];

    // Memoize sorted images to prevent infinite re-renders
    const sortedImages = useMemo(() => {
        return [...images].sort((a, b) => {
            if (a.is_primary) return -1;
            if (b.is_primary) return 1;
            return a.order - b.order;
        });
    }, [images]);

    // Preload images only once when component mounts
    useEffect(() => {
        if (!sortedImages.length) return;

        // Initialize loading state
        setImagesLoaded(new Array(sortedImages.length).fill(false));

        // Preload only the first image immediately, others lazily
        const preloadFirstImage = () => {
            if (sortedImages[0]) {
                const img = new Image();
                img.onload = () => {
                    setImagesLoaded((prev) => {
                        const newLoaded = [...prev];
                        newLoaded[0] = true;
                        return newLoaded;
                    });
                };
                img.onerror = () => {
                    setImagesLoaded((prev) => {
                        const newLoaded = [...prev];
                        newLoaded[0] = true; // Still show even if failed
                        return newLoaded;
                    });
                };
                img.src = sortedImages[0].image || '/assets/placeholder.png';
            }
        };

        preloadFirstImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortedImages.length]);

    // Preload next image when index changes
    useEffect(() => {
        if (sortedImages[currentImageIndex] && !imagesLoaded[currentImageIndex]) {
            const img = new Image();
            img.onload = () => {
                setImagesLoaded((prev) => {
                    const newLoaded = [...prev];
                    newLoaded[currentImageIndex] = true;
                    return newLoaded;
                });
            };
            img.onerror = () => {
                setImagesLoaded((prev) => {
                    const newLoaded = [...prev];
                    newLoaded[currentImageIndex] = true;
                    return newLoaded;
                });
            };
            img.src = sortedImages[currentImageIndex].image || '/assets/placeholder.png';
        }
    }, [currentImageIndex, sortedImages, imagesLoaded]);

    // Start animation with proper cleanup
    useEffect(() => {
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

    // Handle card click to navigate to detail page
    const handleCardClick = useCallback(() => {
        router.visit(route('branding-projects.detail', project.id));
    }, [project.id]);

    if (!sortedImages.length) return null;

    return (
        <div
            className={`group relative cursor-pointer overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl ${className}`}
            onClick={handleCardClick}
        >
            {/* Image carousel with optimized animation */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <AnimatePresence initial={false}>
                    <motion.img
                        key={currentImageIndex}
                        src={sortedImages[currentImageIndex]?.image || '/assets/placeholder.png'}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ y: '100%', opacity: 1 }}
                        animate={{
                            y: 0,
                            opacity: imagesLoaded[currentImageIndex] ? 1 : 0,
                        }}
                        exit={{ y: '-100%', opacity: 1 }}
                        transition={{
                            duration: 0.7,
                            ease: [0.4, 0, 0.2, 1],
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
