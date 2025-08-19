import { BrandingProjectT } from '@/types';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface BrandingProjectCardProps {
    project: BrandingProjectT & {
        images?: Array<{
            id: number;
            image: string;
            is_primary: boolean;
            order: number;
            cachedImageUrl?: string;
        }>;
    };
    className?: string;
}

export default function BrandingProjectCard({ project, className = '' }: BrandingProjectCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const sortedImages = useMemo(() => {
        const images = project.images || [];
        return [...images].sort((a, b) => {
            if (a.is_primary) return -1;
            if (b.is_primary) return 1;
            return a.order - b.order;
        });
    }, [project.images]);

    // Get cached image URL for the current image
    const currentImageUrl = useMemo(() => {
        const currentImage = sortedImages[currentImageIndex];
        if (!currentImage?.image) return '/assets/placeholder.png';
        // Use cached URL if available, otherwise fallback to original
        return currentImage.cachedImageUrl || currentImage.image;
    }, [sortedImages, currentImageIndex]);

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
                        src={currentImageUrl}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ y: '100%', opacity: 1 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        exit={{ y: '-100%', opacity: 1 }}
                        transition={{
                            duration: 0.7,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        loading="lazy"
                        decoding="async"
                    />
                </AnimatePresence>
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
