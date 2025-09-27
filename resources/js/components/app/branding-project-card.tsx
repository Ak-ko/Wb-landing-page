import { BrandingProjectT } from '@/types';
import { router } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import { useCallback, useMemo } from 'react';

interface BrandingProjectCardProps {
    project: BrandingProjectT & {
        images?: Array<{
            id: number;
            image: string;
            is_primary: boolean;
            order: number;
        }>;
    };
    className?: string;
}

export default function BrandingProjectCard({ project, className = '' }: BrandingProjectCardProps) {
    const sortedImages = useMemo(() => {
        const images = project.images || [];
        return [...images].sort((a, b) => {
            if (a.is_primary) return -1;
            if (b.is_primary) return 1;
            return a.order - b.order;
        });
    }, [project.images]);

    const imageUrl = useMemo(() => {
        const firstImage = sortedImages[0];
        if (!firstImage?.image) return '/assets/placeholder.png';
        return firstImage.image;
    }, [sortedImages]);

    const handleCardClick = useCallback(() => {
        router.visit(route('branding-projects.detail', project.id));
    }, [project.id]);

    if (!sortedImages.length) return null;

    return (
        <div className={`group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl ${className}`} onClick={handleCardClick}>
            {/* Single image display */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img src={imageUrl} alt={project.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
            </div>

            {/* Project info overlay */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100">
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                <p className="mb-1 text-sm text-white/80">{project.client_company}</p>
                {project.client_origin && (
                    <div className="mb-2 flex items-center gap-1 text-xs text-white/70">
                        <MapPin size={12} />
                        <span>{project.client_origin}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
