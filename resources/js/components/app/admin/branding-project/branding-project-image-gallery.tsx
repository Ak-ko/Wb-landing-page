import { Button } from '@/components/ui/button';
import { Image, Play, Plus } from 'lucide-react';
import { useState } from 'react';
import BrandingProjectImageDialog from './branding-project-image-dialog';

interface ImageItem {
    id?: number | string;
    url?: string;
    is_primary: boolean;
    isNew?: boolean;
}

interface BrandingProjectImageGalleryProps {
    images: ImageItem[];
    onImageUpload: (file: File | string, isPrimary?: boolean) => void;
    onImageDelete?: (imageId: number | string) => void;
    onSetPrimaryImage?: (imageId: number | string) => void;
    isEditing: boolean;
}
export default function BrandingProjectImageGallery({
    images,
    onImageUpload,
    onImageDelete,
    onSetPrimaryImage,
    isEditing,
}: BrandingProjectImageGalleryProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    // Check if file is a video based on extension
    const isVideo = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
        const extension = url.toLowerCase().substring(url.lastIndexOf('.'));
        return videoExtensions.includes(extension);
    };

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

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                    <div
                        key={image.id || index}
                        className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-md border"
                        onClick={() => handleOpenDialog(image)}
                    >
                        {image.url && isVideo(image.url) ? (
                            <>
                                <video src={image.url} className="h-full w-full object-cover" muted preload="metadata" playsInline />
                                <div className="absolute top-1/2 left-1/2 z-5 flex size-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/60 transition-all duration-500 group-hover:border-white">
                                    <Play
                                        className="size-[15px] text-white/60 transition-all duration-500 group-hover:text-white"
                                        fill="currentColor"
                                    />
                                </div>
                            </>
                        ) : (
                            <img src={image.url} alt={`Project media ${index + 1}`} className="h-full w-full object-cover" />
                        )}
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
                        <span className="mt-1 text-xs">Add Media</span>
                    </Button>
                )}

                {images.length === 0 && !isEditing && (
                    <div className="flex h-24 w-24 flex-col items-center justify-center rounded-md border border-dashed">
                        <Image className="h-6 w-6 text-gray-400" />
                        <span className="mt-1 text-xs text-gray-500">No media</span>
                    </div>
                )}
            </div>

            <BrandingProjectImageDialog
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
