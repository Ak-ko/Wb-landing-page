import { ImageGalleryProps, ImageItem } from '@/types/common';
import { GripVertical, Image, Play } from 'lucide-react';
import { useCallback, useState } from 'react';

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
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = useCallback(
        (e: React.DragEvent, index: number) => {
            if (!isEditing || !allowDrag) return;
            setDraggedIndex(index);
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', index.toString());
        },
        [isEditing, allowDrag],
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            if (!isEditing || !allowDrag) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        },
        [isEditing, allowDrag],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent, dropIndex: number) => {
            if (!isEditing || !allowDrag || draggedIndex === null || !onReorder) return;
            e.preventDefault();

            const items = Array.from(images);
            const [draggedItem] = items.splice(draggedIndex, 1);
            items.splice(dropIndex, 0, draggedItem);

            onReorder(items);
            setDraggedIndex(null);
        },
        [isEditing, allowDrag, draggedIndex, onReorder, images],
    );

    const handleDragEnd = useCallback(() => {
        setDraggedIndex(null);
    }, []);

    const isVideoFile = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
    };

    const renderImageItem = useCallback(
        (image: ImageItem, index: number) => {
            const imageId = image.id?.toString() || `new-${index}`;
            const isVideo = isVideoFile(image.url || '');

            return (
                <div
                    key={imageId}
                    draggable={isEditing && allowDrag}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative cursor-pointer overflow-hidden rounded-md border transition-all duration-200 ${
                        draggedIndex === index ? 'scale-95 opacity-50' : 'hover:shadow-md'
                    } ${isEditing ? 'hover:scale-105' : ''} ${imageClassName}`}
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
                        <img src={image.url} alt={`Image ${index + 1}`} className="h-full w-full object-cover" />
                    )}

                    {isEditing && allowDrag && showDragHandle && (
                        <div
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
        },
        [
            isEditing,
            allowDrag,
            draggedIndex,
            handleDragStart,
            handleDragOver,
            handleDrop,
            handleDragEnd,
            onImageClick,
            imageClassName,
            showPrimaryBadge,
            showMascotBadge,
            showDragHandle,
        ],
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

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex flex-wrap gap-4">
                {images.map(renderImageItem)}

                {images.length === 0 && !isEditing && renderEmptyState()}
            </div>
        </div>
    );
}
