import { ImageGalleryProps, ImageItem } from '@/types/common';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Image, Play } from 'lucide-react';
import { useCallback } from 'react';

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

function SortableImageItem({
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

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isVideoFile = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
    };

    const isVideo = isVideoFile(image.url || '');

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative cursor-pointer overflow-hidden rounded-md border transition-all duration-200 hover:shadow-md ${
                isEditing && allowDrag ? 'hover:scale-105' : ''
            } ${imageClassName}`}
            onClick={() => onImageClick?.(image)}
        >
            {isVideo ? (
                <div className="relative h-full w-full">
                    <video src={image.url} className="h-full w-full object-cover" muted preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80">
                            <Play className="ml-0.5 h-4 w-4 text-gray-800" />
                        </div>
                    </div>
                </div>
            ) : (
                <img src={image.url} alt={`Image ${index + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            )}

            {isEditing && allowDrag && showDragHandle && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-1 left-1 cursor-grab rounded bg-black/50 p-1 text-white transition-colors duration-200 hover:bg-black/70 active:cursor-grabbing"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical className="h-3 w-3" />
                </div>
            )}

            <div className="absolute top-1 right-1 flex flex-col gap-1">
                {showPrimaryBadge && image.is_primary && (
                    <span className="bg-primary rounded-full px-1.5 py-0.5 text-[10px] text-white">Primary</span>
                )}
                {showMascotBadge && image.is_mascot && (
                    <span className="bg-secondary-pink rounded-full px-1.5 py-0.5 text-[10px] text-white">Mascot</span>
                )}
            </div>
        </div>
    );
}

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
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            if (over && active.id !== over.id && onReorder) {
                const oldIndex = images.findIndex((img) => (img.id?.toString() || `new-${images.indexOf(img)}`) === active.id);
                const newIndex = images.findIndex((img) => (img.id?.toString() || `new-${images.indexOf(img)}`) === over.id);

                const reorderedImages = arrayMove(images, oldIndex, newIndex);
                onReorder(reorderedImages);
            }
        },
        [images, onReorder],
    );

    const renderEmptyState = useCallback(
        () => (
            <div className={`flex flex-col items-center justify-center rounded-md border border-dashed ${imageClassName}`}>
                <Image className="h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">No media</span>
            </div>
        ),
        [imageClassName],
    );

    const items = images.map((img, index) => img.id?.toString() || `new-${index}`);

    if (images.length === 0 && !isEditing) {
        return (
            <div className={`space-y-4 ${className}`}>
                <div className="flex flex-wrap gap-4">{renderEmptyState()}</div>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
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
            </DndContext>
        </div>
    );
}
