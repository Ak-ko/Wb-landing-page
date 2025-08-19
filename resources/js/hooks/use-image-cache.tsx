/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

// Global image cache to store loaded images as object URLs
const globalImageCache = new Map<string, string>();

interface UseImageCacheOptions {
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
}

export const useImageCache = (imageUrls: string[], options: UseImageCacheOptions = {}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!imageUrls || imageUrls.length === 0) {
            setIsLoaded(true);
            setProgress(100);
            options.onComplete?.();
            return;
        }

        let loadedCount = 0;
        const totalImages = imageUrls.length;
        const imagesToLoad: string[] = [];

        // Filter out already cached images
        imageUrls.forEach((imageSrc) => {
            if (!globalImageCache.has(imageSrc)) {
                imagesToLoad.push(imageSrc);
            } else {
                loadedCount++;
            }
        });

        // If all images are already cached, show immediately
        if (imagesToLoad.length === 0) {
            setIsLoaded(true);
            setProgress(100);
            options.onProgress?.(100);
            options.onComplete?.();
            return;
        }

        const checkAllLoaded = () => {
            loadedCount++;
            const currentProgress = Math.round((loadedCount / totalImages) * 100);
            setProgress(currentProgress);
            options.onProgress?.(currentProgress);

            if (loadedCount >= totalImages) {
                setIsLoaded(true);
                options.onComplete?.();
            }
        };

        // Load only uncached images
        imagesToLoad.forEach((imageSrc) => {
            const img = new Image();

            img.onload = () => {
                try {
                    // Try to create object URL from the loaded image
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        // Fallback: use original URL if canvas is not available
                        globalImageCache.set(imageSrc, imageSrc);
                        checkAllLoaded();
                        return;
                    }

                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;

                    // Draw the image to canvas
                    ctx.drawImage(img, 0, 0);

                    // Convert to blob
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const objectUrl = URL.createObjectURL(blob);
                                globalImageCache.set(imageSrc, objectUrl);
                            } else {
                                // Fallback: use original URL if blob creation fails
                                globalImageCache.set(imageSrc, imageSrc);
                            }
                            checkAllLoaded();
                        },
                        'image/jpeg',
                        0.9,
                    );
                } catch (error) {
                    console.error(`Error caching image ${imageSrc}:`, error);
                    // Fallback: use original URL
                    globalImageCache.set(imageSrc, imageSrc);
                    checkAllLoaded();
                }
            };

            img.onerror = () => {
                console.error(`Failed to load image: ${imageSrc}`);
                // Create a placeholder blob
                try {
                    const placeholderSvg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#f3f4f6"/>
                        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">Image Load Error</text>
                    </svg>`;
                    const placeholderBlob = new Blob([placeholderSvg], { type: 'image/svg+xml' });
                    const placeholderUrl = URL.createObjectURL(placeholderBlob);
                    globalImageCache.set(imageSrc, placeholderUrl);
                } catch (error) {
                    console.error(`Error creating placeholder for ${imageSrc}:`, error);
                    globalImageCache.set(imageSrc, imageSrc);
                }
                checkAllLoaded();
            };

            // Set crossOrigin before setting src
            img.crossOrigin = 'anonymous';
            img.src = imageSrc;
        });
    }, [imageUrls, options.onProgress, options.onComplete]);

    return {
        isLoaded,
        progress,
        // Utility function to check if an image is cached
        isImageCached: (url: string) => globalImageCache.has(url),
        // Utility function to get cached image URL
        getCachedImageUrl: (url: string) => globalImageCache.get(url) || url,
    };
};

// Utility function to preload a single image
export const preloadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (globalImageCache.has(url)) {
            resolve(globalImageCache.get(url)!);
            return;
        }

        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    globalImageCache.set(url, url);
                    resolve(url);
                    return;
                }

                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const objectUrl = URL.createObjectURL(blob);
                            globalImageCache.set(url, objectUrl);
                            resolve(objectUrl);
                        } else {
                            globalImageCache.set(url, url);
                            resolve(url);
                        }
                    },
                    'image/jpeg',
                    0.9,
                );
            } catch (error) {
                console.error(`Error preloading image ${url}:`, error);
                globalImageCache.set(url, url);
                resolve(url);
            }
        };
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.src = url;
    });
};

// Utility function to clear the cache (useful for memory management)
export const clearImageCache = () => {
    // Revoke all object URLs to free memory
    globalImageCache.forEach((objectUrl) => {
        if (objectUrl.startsWith('blob:')) {
            URL.revokeObjectURL(objectUrl);
        }
    });
    globalImageCache.clear();
};

// Utility function to get cache size
export const getImageCacheSize = () => {
    return globalImageCache.size;
};

// Utility function to get cached URL for use in img src
export const getCachedImageSrc = (originalUrl: string): string => {
    const cachedUrl = globalImageCache.get(originalUrl);

    return cachedUrl || originalUrl;
};
