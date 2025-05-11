import { BrandingProjectT } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BrandingProjectCardProps {
    project: BrandingProjectT;
    className?: string;
}

export default function BrandingProjectCard({ project, className = '' }: BrandingProjectCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = project.images || [];

    // Find primary image and put it first
    const sortedImages = [...images].sort((a, b) => {
        if (a.is_primary) return -1;
        if (b.is_primary) return 1;
        return a.order - b.order;
    });

    useEffect(() => {
        if (sortedImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [sortedImages.length]);

    if (!sortedImages.length) return null;

    return (
        <div className={`group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl ${className}`}>
            {/* Image carousel with scroll-up animation */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <AnimatePresence initial={false}>
                    <motion.img
                        key={currentImageIndex}
                        src={sortedImages[currentImageIndex]?.image || '/assets/placeholder.png'}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ y: '100%', opacity: 1 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '-100%', opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </AnimatePresence>
            </div>

            {/* Project info overlay */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                <p className="mb-2 text-sm text-white/80">{project.client_company}</p>
            </div>
        </div>
    );
}
