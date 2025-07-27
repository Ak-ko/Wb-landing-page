import FormField from '@/components/common/form-field';
import ImageDialog from '@/components/common/image-dialog';
import ImageGallery from '@/components/common/image-gallery';
import MultiImageUploader from '@/components/common/multi-image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StickerArtT } from '@/types';
import { ImageItem, NewImage } from '@/types/common';
import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface StickerArtFormProps {
    stickerArt?: StickerArtT;
    onSuccess?: () => void;
}

export default function StickerArtForm({ stickerArt, onSuccess }: StickerArtFormProps) {
    const [existingImages, setExistingImages] = useState(
        stickerArt?.images.map((img) => ({
            id: img.id,
            url: `${img.image}`,
            order: img.order,
        })) || [],
    );
    const [newImages, setNewImages] = useState<NewImage[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        title: stickerArt?.title || '',
        description: stickerArt?.description || '',
        images: stickerArt?.images?.map((stickerArtImage) => stickerArtImage?.image) || ([] as string[]),
        new_images: [],
        removed_images: [] as number[],
    });

    const displayImages = useMemo(() => {
        return [
            ...existingImages,
            ...newImages.map((img, index) => ({
                id: `new-${index}`,
                url: img.url,
                order: existingImages.length + index,
                isNew: true,
                file: img.file,
            })),
        ];
    }, [existingImages, newImages]);

    const handleImageUpload = (file: File | string) => {
        if (typeof file !== 'string') return;

        const newImage = {
            file,
            url: `/storage/${file}`,
            is_primary: false,
        };

        setNewImages((prev) => [...prev, newImage]);
        setData('images', [...data.images, file]);
    };

    const handleImageUploadForGallery = (file: File | string) => {
        handleImageUpload(file);
    };

    const handleRemoveExistingImage = (imageId: number) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        setData('removed_images', [...data.removed_images, imageId]);
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setData(
            'images',
            data.images.filter((_, i) => i !== index),
        );
    };

    const handleImageReorder = (reorderedImages: ImageItem[]) => {
        const existingImagesMap = new Map(existingImages.map((img) => [img.id, img]));
        const newImagesMap = new Map(newImages.map((img, index) => [`new-${index}`, img]));

        const reorderedExisting: typeof existingImages = [];
        const reorderedNew: NewImage[] = [];

        reorderedImages.forEach((img, index) => {
            if (typeof img.id === 'number') {
                const existingImage = existingImagesMap.get(img.id);
                if (existingImage) {
                    reorderedExisting.push({
                        ...existingImage,
                        order: index,
                    });
                }
            } else if (typeof img.id === 'string' && img.id.startsWith('new-')) {
                const newImage = newImagesMap.get(img.id);
                if (newImage) {
                    reorderedNew.push({
                        ...newImage,
                        order: index,
                    });
                }
            }
        });

        setExistingImages(reorderedExisting);
        setNewImages(reorderedNew);
    };

    const getImagePath = (img: ImageItem) => {
        if (typeof img.id === 'number') {
            return (img.url || '').replace('/storage/', '');
        } else {
            const newImg = img as { id: string; url: string; isNew: boolean; file: string | File };
            return typeof newImg.file === 'string' ? newImg.file : (newImg.url || '').replace('/storage/', '');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = stickerArt ? route('sticker-art.update', stickerArt.id) : route('sticker-art.store');

        const reorderedImagePaths = displayImages.map(getImagePath);

        const reorderedNewImages = displayImages
            .filter((img): img is { id: string; url: string; isNew: boolean; file: string | File; order: number } => 'isNew' in img && img.isNew)
            .map((img) => {
                // Extract just the file path for new images
                const filePath = typeof img.file === 'string' ? img.file : img.url.replace('/storage/', '');
                return filePath;
            });

        transform((data) => ({
            ...data,
            images: reorderedImagePaths,
            new_images: reorderedNewImages,
        }));

        if (stickerArt) {
            put(url, { onSuccess });
        } else {
            post(url, {
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                },
            });
        }
    };

    const handleImageDelete = (imageId: number | string) => {
        if (typeof imageId === 'number') {
            handleRemoveExistingImage(imageId);
        } else if (typeof imageId === 'string' && imageId.startsWith('new-')) {
            const index = parseInt(imageId.replace('new-', ''), 10);
            handleRemoveNewImage(index);
        }
    };

    const handleImageClick = (image: ImageItem) => {
        setSelectedImage(image);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedImage(null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Sticker Art Title" required error={errors.title}>
                <Input placeholder="Enter sticker art title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
            </FormField>

            <FormField label="Description" error={errors.description}>
                <Textarea
                    placeholder="Enter sticker art description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                />
            </FormField>

            <FormField label="Sticker Art Images" required error={errors.images}>
                <MultiImageUploader
                    onImageChange={handleImageUpload}
                    onImageRemove={() => {}}
                    error={errors.images}
                    maxFiles={10}
                    showLabel={false}
                    helperText="SVG, PNG, JPG or GIF (max. 300 MB each)"
                />

                {displayImages.length > 0 && (
                    <div className="mt-6">
                        <h4 className="mb-3 text-sm font-medium text-gray-700">Uploaded Images ({displayImages.length})</h4>
                        <ImageGallery
                            images={displayImages}
                            onImageClick={handleImageClick}
                            onReorder={handleImageReorder}
                            isEditing={true}
                            allowDrag={!!stickerArt}
                            showPrimaryBadge={false}
                        />
                    </div>
                )}
            </FormField>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : stickerArt ? 'Update Sticker Art' : 'Create Sticker Art'}
                </Button>
            </div>

            <ImageDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                image={selectedImage || undefined}
                onDelete={handleImageDelete}
                onUpload={handleImageUploadForGallery}
                isEditing={true}
                title="Manage Sticker Art Image"
                uploadTitle="Upload New Sticker Art Image"
                manageTitle="Manage Sticker Art Image"
                addTitle="Add New Sticker Art Image"
                showPrimaryOption={false}
            />
        </form>
    );
}
