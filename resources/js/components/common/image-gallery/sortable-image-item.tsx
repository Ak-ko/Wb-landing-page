import { ImageItem } from '@/types/common';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { OptimizedImage } from './optimized-image';
import { OptimizedVideo } from './optimized-video';
import { getOptimizedImageUrl, isVideoFile } from './utils';

interface SortableImageItemProps {
    image: ImageItem;
    index: number;
    isEditing: boolean;
    allowDrag: boolean;
    showPrimaryBadge: boolean;
    showMascotBadge: boolean;
    showDragHandle: boolean;
    imageClassName: string;
    onImageClick?: (image: ImageItem) => void;
}

/**
 * Memoized sortable item to prevent unnecessary re-renders
 * Features:
 * - Drag and drop support via dnd-kit
 * - Smooth transitions and opacity changes
 * - Primary and Mascot badges
 * - Touch-friendly drag handles
 * - Optimized re-render prevention
 */
export const SortableImageItem = memo(function SortableImageItem({
    image,
    index,
    isEditing,
    allowDrag,
    showPrimaryBadge,
    showMascotBadge,
    showDragHandle,
    imageClassName,
    onImageClick,
}: SortableImageItemProps) {
    const imageId = image.id?.toString() || `new-${index}`;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: imageId,
        disabled: !isEditing || !allowDrag,
    });

    const style = useMemo(
        () => ({
            transform: CSS.Transform.toString(transform),
            transition: isDragging ? 'none' : transition,
            opacity: isDragging ? 0.5 : 1,
            // GPU acceleration for smooth transforms
            willChange: isDragging ? 'transform' : 'auto',
            zIndex: isDragging ? 999 : 'auto',
        }),
        [transform, transition, isDragging],
    );

    const isVideo = useMemo(() => isVideoFile(image.url || ''), [image.url]);
    const optimizedUrl = useMemo(() => getOptimizedImageUrl(image.url || ''), [image.url]);

    const handleClick = useCallback(() => {
        onImageClick?.(image);
    }, [image, onImageClick]);

    const handleDragClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative transform-gpu cursor-pointer overflow-hidden rounded-md border bg-gray-50 backface-hidden ${
                isDragging ? '' : 'transition-shadow duration-200 hover:shadow-md'
            } ${imageClassName}`}
            onClick={handleClick}
        >
            <div className={isDragging ? 'pointer-events-none select-none' : ''}>
                {isVideo ? (
                    <OptimizedVideo src={image.url || ''} className="h-full w-full object-cover" />
                ) : (
                    <OptimizedImage src={optimizedUrl} alt={`Image ${index + 1}`} className="h-full w-full object-cover" />
                )}
            </div>

            {isEditing && allowDrag && showDragHandle && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-1 left-1 cursor-grab touch-none rounded bg-black/50 p-1 text-white transition-colors duration-200 hover:bg-black/70 active:cursor-grabbing"
                    onClick={handleDragClick}
                >
                    <GripVertical className="h-3 w-3" />
                </div>
            )}

            <div className="absolute top-1 right-1 flex flex-col gap-1">
                {showPrimaryBadge && image.is_primary && (
                    <span className="bg-primary rounded-full px-1.5 py-0.5 text-[10px] text-white shadow-sm">Primary</span>
                )}
                {showMascotBadge && image.is_mascot && (
                    <span className="bg-secondary-pink rounded-full px-1.5 py-0.5 text-[10px] text-white shadow-sm">Mascot</span>
                )}
            </div>
        </div>
    );
});
