import { Button } from '@/components/ui/button';
import { Image, Plus } from 'lucide-react';
import { useState } from 'react';
import ComicArtImageDialog from './comic-art-image-dialog';

interface ImageItem {
    id?: number | string;
    url?: string;
    is_primary: boolean;
    isNew?: boolean;
}

interface ComicImageGalleryProps {
    images: ImageItem[];
    onImageUpload: (file: File | string) => void;
    onImageDelete?: (imageId: number | string) => void;
    isEditing: boolean;
}

export default function ComicImageGallery({ images, onImageUpload, onImageDelete, isEditing }: ComicImageGalleryProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    const handleOpenDialog = (image?: ImageItem) => {
        setSelectedImage(image || { is_primary: false });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedImage(null);
    };

    const handleImageUpload = (file: File | string) => {
        onImageUpload(file);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                    <div
                        key={image.id || index}
                        className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-md border"
                        onClick={() => handleOpenDialog(image)}
                    >
                        <img src={image.url} alt={`Comic image ${index + 1}`} className="h-full w-full object-cover" />
                        {image.is_primary && (
                            <div className="absolute top-1 right-1">
                                <span className="bg-primary rounded-full px-1.5 py-0.5 text-[10px] text-white">Primary</span>
                            </div>
                        )}
                    </div>
                ))}

                {isEditing && (
                    <Button
                        type="button"
                        variant="outline"
                        className="flex h-24 w-24 flex-col items-center justify-center rounded-md border border-dashed"
                        onClick={() => handleOpenDialog()}
                    >
                        <Plus className="h-6 w-6" />
                        <span className="mt-1 text-xs">Add Image</span>
                    </Button>
                )}

                {images.length === 0 && !isEditing && (
                    <div className="flex h-24 w-24 flex-col items-center justify-center rounded-md border border-dashed">
                        <Image className="h-6 w-6 text-gray-400" />
                        <span className="mt-1 text-xs text-gray-500">No images</span>
                    </div>
                )}
            </div>

            <ComicArtImageDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                image={selectedImage || undefined}
                onDelete={onImageDelete}
                onUpload={handleImageUpload}
                isEditing={isEditing}
            />
        </div>
    );
}
