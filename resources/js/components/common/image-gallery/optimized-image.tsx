import { Image } from 'lucide-react';
import { memo, useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className: string;
}

/**
 * Memoized image component with progressive loading
 * Features:
 * - Loading state with skeleton loader
 * - Error handling with fallback UI
 * - Smooth fade-in transition
 * - Low fetch priority for performance
 */
export const OptimizedImage = memo(({ src, alt, className }: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative ${className}`}>
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-100">
                    <Image className="h-6 w-6 text-gray-300" />
                </div>
            )}
            {hasError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                        <Image className="mx-auto h-6 w-6 text-gray-400" />
                        <span className="mt-1 text-xs text-gray-500">Failed to load</span>
                    </div>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className={`h-full w-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setHasError(true)}
                    // Use smaller fetch priority for non-critical images
                    fetchPriority="low"
                />
            )}
        </div>
    );
});

OptimizedImage.displayName = 'OptimizedImage';
