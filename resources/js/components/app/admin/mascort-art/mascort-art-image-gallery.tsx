import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import MascortArtImageDialog from './mascort-art-image-dialog';

interface ImageItem {
    id?: number | string;
    url?: string;
    is_primary: boolean;
    is_mascot: boolean;
    isNew?: boolean;
}

interface MascortArtImageGalleryProps {
    images: ImageItem[];
    onImageUpload: (file: File | string, isPrimary?: boolean, isMascot?: boolean) => void;
    onImageDelete?: (imageId: number | string) => void;
    onSetPrimaryImage?: (imageId: number | string) => void;
    onSetMascotImage?: (imageId: number | string) => void;
    isEditing: boolean;
}

export default function MascortArtImageGallery({
    images,
    onImageUpload,
    onImageDelete,
    onSetPrimaryImage,
    onSetMascotImage,
    isEditing,
}: MascortArtImageGalleryProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    const handleOpenDialog = (image?: ImageItem) => {
        setSelectedImage(image || { is_primary: false, is_mascot: false });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedImage(null);
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
                        <img src={image.url} alt={`Mascot art image ${index + 1}`} className="h-full w-full object-cover" />
                        <div className="absolute top-1 right-1 flex flex-col gap-1">
                            {image.is_primary && <span className="bg-primary rounded-full px-2 py-1 text-xs text-white">Primary</span>}
                            {image.is_mascot && <span className="bg-secondary-pink rounded-full px-2 py-1 text-xs text-white">Mascot</span>}
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed"
                    onClick={() => handleOpenDialog()}
                >
                    <Plus className="h-4 w-4" />
                    <span className="text-xs">Add Image</span>
                </Button>
            </div>

            <MascortArtImageDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                image={selectedImage || undefined}
                onUpload={onImageUpload}
                onDelete={onImageDelete}
                onSetPrimary={onSetPrimaryImage}
                onSetMascot={onSetMascotImage}
                isEditing={isEditing}
            />
        </div>
    );
}
