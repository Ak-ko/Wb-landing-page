import { GripVertical, Image } from 'lucide-react';
import { useCallback, useState } from 'react';
import BlogImageDialog from './blog-image-dialog';

interface ImageItem {
    id?: number | string;
    url?: string;
    is_primary: boolean;
    isNew?: boolean;
}

interface BlogImageGalleryProps {
    images: ImageItem[];
    onImageUpload: (file: File | string, isPrimary?: boolean) => void;
    onImageDelete?: (imageId: number | string) => void;
    onSetPrimaryImage?: (imageId: number | string) => void;
    onReorder?: (reorderedImages: ImageItem[]) => void;
    isEditing: boolean;
    allowDrag?: boolean;
}

export default function BlogImageGallery({
    images,
    onImageUpload,
    onImageDelete,
    onSetPrimaryImage,
    onReorder,
    isEditing,
    allowDrag = false,
}: BlogImageGalleryProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleOpenDialog = useCallback((image?: ImageItem) => {
        setSelectedImage(image || { is_primary: false });
        setDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedImage(null);
    }, []);

    const handleImageUpload = useCallback(
        (file: File | string, isPrimary: boolean) => {
            onImageUpload(file, isPrimary);
        },
        [onImageUpload],
    );

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

    const renderImageItem = useCallback(
        (image: ImageItem, index: number) => {
            const imageId = image.id?.toString() || `new-${index}`;

            return (
                <div
                    key={imageId}
                    draggable={isEditing && allowDrag}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative h-24 w-24 cursor-pointer overflow-hidden rounded-md border transition-all duration-200 ${
                        draggedIndex === index ? 'scale-95 opacity-50' : 'hover:shadow-md'
                    } ${isEditing ? 'hover:scale-105' : ''}`}
                    onClick={() => handleOpenDialog(image)}
                >
                    <img src={image.url} alt={`Blog image ${index + 1}`} className="h-full w-full object-cover" />

                    {isEditing && allowDrag && (
                        <div
                            className="absolute top-1 left-1 cursor-grab rounded bg-black/50 p-1 text-white transition-colors duration-200 hover:bg-black/70 active:cursor-grabbing"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical className="h-3 w-3" />
                        </div>
                    )}

                    {image.is_primary && (
                        <div className="absolute top-1 right-1">
                            <span className="bg-primary rounded-full px-1.5 py-0.5 text-[10px] text-white">Primary</span>
                        </div>
                    )}
                </div>
            );
        },
        [isEditing, allowDrag, draggedIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd, handleOpenDialog],
    );

    const renderEmptyState = useCallback(
        () => (
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-md border border-dashed">
                <Image className="h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">No images</span>
            </div>
        ),
        [],
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {images.map(renderImageItem)}

                {images.length === 0 && !isEditing && renderEmptyState()}
            </div>

            <BlogImageDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                image={selectedImage || undefined}
                onDelete={onImageDelete}
                onSetPrimary={onSetPrimaryImage}
                onUpload={handleImageUpload}
                isEditing={isEditing}
            />
        </div>
    );
}
