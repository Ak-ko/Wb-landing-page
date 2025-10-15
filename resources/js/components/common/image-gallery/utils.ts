/**
 * Utility functions for image gallery
 */

/**
 * Check if a URL points to a video file
 */
export const isVideoFile = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

/**
 * Optimized thumbnail URL generator for CDN images
 * TODO: In production, consider using an image optimization service like:
 * - Cloudflare Images
 * - imgix
 * - Cloudinary
 * - AWS Lambda@Edge for on-the-fly resizing
 */
export const getOptimizedImageUrl = (url: string): string => {
    // For DigitalOcean Spaces CDN, we can't resize directly
    // Example with image service: return `${url}?w=200&h=200&fit=cover&auto=format&q=80`;
    return url;
};
