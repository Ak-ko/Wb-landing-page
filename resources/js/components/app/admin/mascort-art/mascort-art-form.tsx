import FormField from '@/components/common/form-field';
import ImageDialog from '@/components/common/image-dialog';
import ImageGallery from '@/components/common/image-gallery';
import MultiImageUploader from '@/components/common/multi-image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { shouldBePrimaryImage } from '@/lib/utils';
import { MascortArtT } from '@/types';
import { ImageItem, NewImage } from '@/types/common';
import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface MascortArtFormProps {
    mascortArt?: MascortArtT;
    onSuccess?: () => void;
}

export default function MascortArtForm({ mascortArt, onSuccess }: MascortArtFormProps) {
    const [existingImages, setExistingImages] = useState(
        mascortArt?.images.map((img) => ({
            id: img.id,
            url: `${img.image}`,
            is_primary: img.is_primary,
            is_mascot: img.is_mascot,
            order: img.order,
        })) || [],
    );
    const [newImages, setNewImages] = useState<NewImage[]>([]);
    const [reorderedImages, setReorderedImages] = useState<ImageItem[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        title: mascortArt?.title || '',
        description: mascortArt?.description || '',
        images: mascortArt?.images?.map((mascortArtImage) => mascortArtImage?.image) || ([] as string[]),
        new_images: [],
        removed_images: [] as number[],
        primary_image_id: mascortArt?.images.find((img) => img.is_primary)?.id || null,
        primary_image_index: null as number | null,
        mascot_image_id: mascortArt?.images.find((img) => img.is_mascot)?.id || null,
        mascot_image_index: null as number | null,
    });

    const displayImages = useMemo(() => {
        // If we have reordered images, use them; otherwise, use the default order
        if (reorderedImages.length > 0) {
            return reorderedImages;
        }

        return [
            ...existingImages,
            ...newImages.map((img, index) => ({
                id: `new-${index}`,
                url: img.url,
                is_primary: img.is_primary,
                is_mascot: img.is_mascot,
                order: existingImages.length + index,
                isNew: true,
                file: img.file,
            })),
        ];
    }, [existingImages, newImages, reorderedImages]);

    const updatePrimaryImageStatus = (isPrimary: boolean, targetId?: number | null, isNew = false) => {
        if (!isPrimary) return;

        setExistingImages((prev) =>
            prev.map((img) => ({
                ...img,
                is_primary: !isNew && targetId !== null ? img.id === targetId : false,
            })),
        );

        setNewImages((prev) =>
            prev.map((img, i) => ({
                ...img,
                is_primary: isNew && targetId !== null ? i === targetId : false,
            })),
        );

        if (!isNew && targetId !== null) {
            setData('primary_image_id', targetId as number);
            setData('primary_image_index', null);
        } else if (isNew && targetId !== null) {
            setData('primary_image_id', null);
            setData('primary_image_index', targetId as number);
        }
    };

    const updateMascotImageStatus = (isMascot: boolean, targetId?: number | null, isNew = false) => {
        if (!isMascot) return;

        setExistingImages((prev) =>
            prev.map((img) => ({
                ...img,
                is_mascot: !isNew && targetId !== null ? img.id === targetId : false,
            })),
        );

        setNewImages((prev) =>
            prev.map((img, i) => ({
                ...img,
                is_mascot: isNew && targetId !== null ? i === targetId : false,
            })),
        );

        if (!isNew && targetId !== null) {
            setData('mascot_image_id', targetId as number);
            setData('mascot_image_index', null);
        } else if (isNew && targetId !== null) {
            setData('mascot_image_id', null);
            setData('mascot_image_index', targetId as number);
        }
    };

    const updateNewImagesWithPrimary = (newImage: NewImage) => {
        setNewImages((prev) => {
            const updatedImages = prev.map((img) => ({ ...img, is_primary: false }));
            return [...updatedImages, newImage];
        });
    };

    const updateNewImagesWithMascot = (newImage: NewImage) => {
        setNewImages((prev) => {
            const updatedImages = prev.map((img) => ({ ...img, is_mascot: false }));
            return [...updatedImages, newImage];
        });
    };

    const handleImageUpload = (file: File | string, index?: number, total?: number, isPrimary = false, isMascot = false) => {
        if (typeof file !== 'string') return;

        const currentNewImagesLength = newImages.length;
        const currentExistingImagesLength = existingImages.length;
        const primary = shouldBePrimaryImage(currentNewImagesLength, currentExistingImagesLength, isPrimary, index, total);

        const newImage = {
            file,
            url: `/storage/${file}`,
            is_primary: primary,
            is_mascot: isMascot,
        };

        const newIndex = currentNewImagesLength;

        if (primary) {
            setData('primary_image_index', newIndex);
            updateNewImagesWithPrimary(newImage);
        } else if (isMascot) {
            setData('mascot_image_index', newIndex);
            updateNewImagesWithMascot(newImage);
        } else {
            setNewImages((prev) => [...prev, newImage]);
        }

        setData('images', [...data.images, file]);
    };

    const handleImageUploadForGallery = (file: File | string, isPrimary = false, isMascot = false) => {
        handleImageUpload(file, undefined, undefined, isPrimary, isMascot);
    };

    const handleRemoveExistingImage = (imageId: number) => {
        const isRemovingPrimary = existingImages.find((img) => img.id === imageId)?.is_primary || false;
        const isRemovingMascot = existingImages.find((img) => img.id === imageId)?.is_mascot || false;

        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        setData('removed_images', [...data.removed_images, imageId]);

        if (isRemovingPrimary) {
            const nextImage = existingImages.find((img) => img.id !== imageId);
            if (nextImage) {
                updatePrimaryImageStatus(true, nextImage.id, false);
            } else if (newImages.length > 0) {
                updatePrimaryImageStatus(true, 0, true);
            } else {
                setData('primary_image_id', null);
                setData('primary_image_index', null);
            }
        }

        if (isRemovingMascot) {
            const nextImage = existingImages.find((img) => img.id !== imageId);
            if (nextImage) {
                updateMascotImageStatus(true, nextImage.id, false);
            } else if (newImages.length > 0) {
                updateMascotImageStatus(true, 0, true);
            } else {
                setData('mascot_image_id', null);
                setData('mascot_image_index', null);
            }
        }
    };

    const handleRemoveNewImage = (index: number) => {
        const isRemovingPrimary = newImages[index]?.is_primary || false;
        const isRemovingMascot = newImages[index]?.is_mascot || false;

        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setData(
            'images',
            data.images.filter((_, i) => i !== index),
        );

        if (isRemovingPrimary) {
            if (newImages.length > 1) {
                const newPrimaryIndex = index === 0 ? 1 : 0;
                updatePrimaryImageStatus(true, newPrimaryIndex, true);
            } else if (existingImages.length > 0) {
                updatePrimaryImageStatus(true, existingImages[0].id, false);
            } else {
                setData('primary_image_id', null);
                setData('primary_image_index', null);
            }
        }

        if (isRemovingMascot) {
            if (newImages.length > 1) {
                const newMascotIndex = index === 0 ? 1 : 0;
                updateMascotImageStatus(true, newMascotIndex, true);
            } else if (existingImages.length > 0) {
                updateMascotImageStatus(true, existingImages[0].id, false);
            } else {
                setData('mascot_image_id', null);
                setData('mascot_image_index', null);
            }
        }
    };

    const handleSetPrimaryImage = (imageId: number | string) => {
        if (typeof imageId === 'number') {
            updatePrimaryImageStatus(true, imageId, false);
        } else if (typeof imageId === 'string' && imageId.startsWith('new-')) {
            const index = parseInt(imageId.replace('new-', ''), 10);
            updatePrimaryImageStatus(true, index, true);
        }
    };

    const handleSetMascotImage = (imageId: number | string) => {
        if (typeof imageId === 'number') {
            updateMascotImageStatus(true, imageId, false);
        } else if (typeof imageId === 'string' && imageId.startsWith('new-')) {
            const index = parseInt(imageId.replace('new-', ''), 10);
            updateMascotImageStatus(true, index, true);
        }
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
                        is_primary: img.is_primary as boolean,
                        is_mascot: Boolean(img.is_mascot),
                        order: index,
                    });
                }
            } else if (typeof img.id === 'string' && img.id.startsWith('new-')) {
                const newImage = newImagesMap.get(img.id);
                if (newImage) {
                    reorderedNew.push({
                        ...newImage,
                        is_primary: img.is_primary as boolean,
                        is_mascot: Boolean(img.is_mascot),
                        order: index,
                    });
                }
            }
        });

        setExistingImages(reorderedExisting);
        setNewImages(reorderedNew);
        setReorderedImages(reorderedImages); // Set the reorderedImages state

        // Update primary and mascot image IDs based on the reordered state
        const primaryImage = reorderedImages.find((img) => img.is_primary);
        const mascotImage = reorderedImages.find((img) => img.is_mascot);

        if (primaryImage && typeof primaryImage.id === 'number') {
            setData('primary_image_id', primaryImage.id);
            setData('primary_image_index', null);
        } else if (primaryImage && typeof primaryImage.id === 'string' && primaryImage.id.startsWith('new-')) {
            const index = parseInt(primaryImage.id.replace('new-', ''), 10);
            setData('primary_image_id', null);
            setData('primary_image_index', index);
        }

        if (mascotImage && typeof mascotImage.id === 'number') {
            setData('mascot_image_id', mascotImage.id);
            setData('mascot_image_index', null);
        } else if (mascotImage && typeof mascotImage.id === 'string' && mascotImage.id.startsWith('new-')) {
            const index = parseInt(mascotImage.id.replace('new-', ''), 10);
            setData('mascot_image_id', null);
            setData('mascot_image_index', index);
        }
    };

    const getImagePath = (img: ImageItem) => {
        if (typeof img.id === 'number') {
            return (img.url || '').replace('/storage/', '');
        } else {
            const newImg = img as { id: string; url: string; is_primary: boolean; is_mascot?: boolean; isNew: boolean; file: string | File };
            return typeof newImg.file === 'string' ? newImg.file : (newImg.url || '').replace('/storage/', '');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = mascortArt ? route('mascort-art.update', mascortArt.id) : route('mascort-art.store');

        const reorderedImagePaths = displayImages.map(getImagePath);

        const reorderedNewImages = displayImages
            .filter(
                (
                    img,
                ): img is { id: string; url: string; is_primary: boolean; is_mascot?: boolean; isNew: boolean; file: string | File; order: number } =>
                    'isNew' in img && (img.isNew as boolean),
            )
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

        if (mascortArt) {
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
            <FormField label="Mascot Art Title" required error={errors.title}>
                <Input placeholder="Enter mascot art title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
            </FormField>

            <FormField label="Description" error={errors.description}>
                <Textarea
                    placeholder="Enter mascot art description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                />
            </FormField>

            <FormField label="Mascot Art Images" required error={errors.images}>
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
                            allowDrag={!!mascortArt}
                            showMascotBadge={true}
                        />
                    </div>
                )}
            </FormField>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : mascortArt ? 'Update Mascot Art' : 'Create Mascot Art'}
                </Button>
            </div>

            <ImageDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                image={selectedImage || undefined}
                onDelete={handleImageDelete}
                onSetPrimary={handleSetPrimaryImage}
                onSetMascot={handleSetMascotImage}
                onUpload={handleImageUploadForGallery}
                isEditing={true}
                title="Manage Mascot Art Image"
                uploadTitle="Upload New Mascot Art Image"
                manageTitle="Manage Mascot Art Image"
                addTitle="Add New Mascot Art Image"
                showMascotOption={true}
            />
        </form>
    );
}
