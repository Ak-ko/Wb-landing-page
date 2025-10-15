import { Play } from 'lucide-react';
import { memo, useState } from 'react';

interface OptimizedVideoProps {
    src: string;
    className: string;
}

/**
 * Memoized video component with lazy loading
 * Features:
 * - Error handling with fallback UI
 * - preload="none" for better performance
 * - Play icon overlay
 * - Muted and inline playback ready
 */
export const OptimizedVideo = memo(({ src, className }: OptimizedVideoProps) => {
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative h-full w-full">
            {hasError ? (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <div className="text-center">
                        <Play className="mx-auto h-6 w-6 text-gray-400" />
                        <span className="mt-1 text-xs text-gray-500">Failed to load</span>
                    </div>
                </div>
            ) : (
                <>
                    <video src={src} className={className} muted preload="none" playsInline onError={() => setHasError(true)} />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80">
                            <Play className="ml-0.5 h-4 w-4 text-gray-800" />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});

OptimizedVideo.displayName = 'OptimizedVideo';
