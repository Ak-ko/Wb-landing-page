import ImageDialog from '@/components/common/image-dialog';
import ImageGallery from '@/components/common/image-gallery';
import { Button } from '@/components/ui/button';
import { ImageItem } from '@/types/common';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface BrandingProjectImageGalleryProps {
    images: ImageItem[];
    onImageUpload: (file: File | string, isPrimary?: boolean) => void;
    onImageDelete?: (imageId: number | string) => void;
    onSetPrimaryImage?: (imageId: number | string) => void;
    onReorder?: (reorderedImages: ImageItem[]) => void;
    isEditing: boolean;
    allowDrag?: boolean;
}

export default function BrandingProjectImageGallery({
    images,
    onImageUpload,
    onImageDelete,
    onSetPrimaryImage,
    onReorder,
    isEditing,
    allowDrag = true,
}: BrandingProjectImageGalleryProps) {
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

    const handleImageUpload = (file: File | string, isPrimary: boolean) => {
        onImageUpload(file, isPrimary);
    };

    const handleImageClick = (image: ImageItem) => {
        handleOpenDialog(image);
    };

    return (
        <div className="space-y-4">
            <ImageGallery
                images={images}
                onImageClick={handleImageClick}
                onReorder={onReorder}
                isEditing={isEditing}
                allowDrag={allowDrag}
                showPrimaryBadge={true}
                showDragHandle={true}
                className=""
                imageClassName="h-24 w-24"
            />

            {isEditing && (
                <Button
                    type="button"
                    variant="outline"
                    className="flex h-24 w-24 flex-col items-center justify-center rounded-md border border-dashed"
                    onClick={() => handleOpenDialog()}
                >
                    <Plus className="h-6 w-6" />
                    <span className="mt-1 text-xs">Add Media</span>
                </Button>
            )}

            <ImageDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                image={selectedImage || undefined}
                onDelete={onImageDelete}
                onSetPrimary={onSetPrimaryImage}
                onUpload={handleImageUpload}
                isEditing={isEditing}
                title="Manage Project Media"
                uploadTitle="Upload New Media"
                manageTitle="Manage Media"
                addTitle="Add New Media"
                placeholderText="Drag and drop or click to upload media"
                helperText="SVG, PNG, JPG, GIF, MP4, WebM (max. 300MB)"
            />
        </div>
    );
}
