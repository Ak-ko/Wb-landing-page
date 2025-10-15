import { ImageGalleryProps } from '@/types/common';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Image } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { SortableImageItem } from './sortable-image-item';

/**
 * Main ImageGallery component with drag-and-drop support
 * Features:
 * - Sortable image/video grid
 * - Drag and drop reordering
 * - Primary and Mascot badges
 * - Empty state handling
 * - Touch and keyboard support
 * - Optimized performance with memoization
 */
export default function ImageGallery({
    images,
    onImageClick,
    onReorder,
    isEditing = false,
    allowDrag = false,
    showPrimaryBadge = true,
    showMascotBadge = false,
    showDragHandle = true,
    className = '',
    imageClassName = 'h-24 w-24',
}: ImageGalleryProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    // Memoize sensors to prevent recreation on every render
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts (prevents accidental drags)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            if (over && active.id !== over.id && onReorder) {
                const oldIndex = images.findIndex((img) => (img.id?.toString() || `new-${images.indexOf(img)}`) === active.id);
                const newIndex = images.findIndex((img) => (img.id?.toString() || `new-${images.indexOf(img)}`) === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    const reorderedImages = arrayMove(images, oldIndex, newIndex);
                    onReorder(reorderedImages);
                }
            }

            setActiveId(null);
        },
        [images, onReorder],
    );

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
    }, []);

    const renderEmptyState = useCallback(
        () => (
            <div className={`flex flex-col items-center justify-center rounded-md border border-dashed ${imageClassName}`}>
                <Image className="h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">No media</span>
            </div>
        ),
        [imageClassName],
    );

    // Memoize items array to prevent unnecessary re-renders
    const items = useMemo(() => images.map((img, index) => img.id?.toString() || `new-${index}`), [images]);

    // Find active image for drag overlay
    const activeImage = useMemo(() => {
        if (!activeId) return null;
        const index = images.findIndex((img) => (img.id?.toString() || `new-${images.indexOf(img)}`) === activeId);
        return index !== -1 ? { image: images[index], index } : null;
    }, [activeId, images]);

    if (images.length === 0 && !isEditing) {
        return (
            <div className={`space-y-4 ${className}`}>
                <div className="flex flex-wrap gap-4">{renderEmptyState()}</div>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <SortableContext items={items} strategy={rectSortingStrategy}>
                    <div className="flex flex-wrap gap-4">
                        {images.map((image, index) => (
                            <SortableImageItem
                                key={image.id?.toString() || `new-${index}`}
                                image={image}
                                index={index}
                                isEditing={isEditing}
                                allowDrag={allowDrag}
                                showPrimaryBadge={showPrimaryBadge}
                                showMascotBadge={showMascotBadge}
                                showDragHandle={showDragHandle}
                                imageClassName={imageClassName}
                                onImageClick={onImageClick}
                            />
                        ))}
                    </div>
                </SortableContext>
                <DragOverlay dropAnimation={null}>
                    {activeImage ? (
                        <div className={`${imageClassName} cursor-grabbing overflow-hidden rounded-md border bg-gray-50 shadow-2xl`}>
                            <img
                                src={activeImage.image.url}
                                alt={`Image ${activeImage.index + 1}`}
                                className="h-full w-full object-cover"
                                draggable={false}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
