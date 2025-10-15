/**
 * Image Gallery Component
 *
 * A high-performance, sortable image/video gallery with drag-and-drop support.
 * Optimized for large images from CDN sources.
 *
 * Usage:
 * ```tsx
 * import ImageGallery from '@/components/common/image-gallery';
 *
 * <ImageGallery
 *   images={images}
 *   onImageClick={handleClick}
 *   onReorder={handleReorder}
 *   isEditing={true}
 *   allowDrag={true}
 * />
 * ```
 */

export { default } from './image-gallery';
export { OptimizedImage } from './optimized-image';
export { OptimizedVideo } from './optimized-video';
export { SortableImageItem } from './sortable-image-item';
export { getOptimizedImageUrl, isVideoFile } from './utils';
