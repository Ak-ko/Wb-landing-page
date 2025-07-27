import ImageDialog from '@/components/common/image-dialog';
import ImageGallery from '@/components/common/image-gallery';
import MultiImageUploader from '@/components/common/multi-image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IllustrationArtT } from '@/types';
import { ImageItem, NewImage } from '@/types/common';
import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface IllustrationFormProps {
    illustrationArt?: IllustrationArtT;
}

export default function IllustrationForm({ illustrationArt }: IllustrationFormProps) {
    const [existingImages, setExistingImages] = useState(
        illustrationArt?.images.map((img) => ({
            id: img.id,
            url: `${img.image}`,
            order: img.order,
        })) || [],
    );
    const [newImages, setNewImages] = useState<NewImage[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        title: illustrationArt?.title || '',
        description: illustrationArt?.description || '',
        images: illustrationArt?.images?.map((illustration) => illustration?.image) || ([] as string[]),
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

        const newImage: NewImage = {
            file,
            url: `/storage/${file}`,
        };

        setNewImages((prev) => [...prev, newImage]);
        setData('images', [...data.images, file]);
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

        reorderedImages.forEach((img) => {
            if (typeof img.id === 'number') {
                const existingImage = existingImagesMap.get(img.id);
                if (existingImage) {
                    reorderedExisting.push({
                        ...existingImage,
                        order: img.order as number,
                    });
                }
            } else if (typeof img.id === 'string' && img.id.startsWith('new-')) {
                const newImage = newImagesMap.get(img.id);
                if (newImage) {
                    reorderedNew.push({
                        ...newImage,
                        order: img.order as number,
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
            const newImg = img as { id: string; url: string; order: number; isNew: boolean; file: string | File };
            return typeof newImg.file === 'string' ? newImg.file : (newImg.url || '').replace('/storage/', '');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = illustrationArt ? route('illustration-art.update', illustrationArt.id) : route('illustration-art.store');

        const reorderedImagePaths = displayImages.map(getImagePath);

        const reorderedNewImages = displayImages
            .filter((img): img is { id: string; url: string; order: number; isNew: boolean; file: string | File } => 'isNew' in img && img.isNew)
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

        if (illustrationArt) {
            put(url);
        } else {
            post(url, {
                onSuccess: () => {
                    reset();
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
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                    Illustration Title <span className="text-red-500">*</span>
                </label>
                <Input id="title" placeholder="Enter illustration title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <Textarea
                    id="description"
                    placeholder="Enter illustration description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Illustrations <span className="text-red-500">*</span>
                </label>
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
                            allowDrag={!!illustrationArt}
                        />
                    </div>
                )}
                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {illustrationArt ? 'Update Illustration' : 'Create Illustration'}
                </Button>
            </div>

            <ImageDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                image={selectedImage || undefined}
                onDelete={handleImageDelete}
                onUpload={handleImageUpload}
                isEditing={true}
                title="Manage Illustration Image"
                uploadTitle="Upload New Illustration Image"
                manageTitle="Manage Illustration Image"
                addTitle="Add New Illustration Image"
                showPrimaryOption={false}
            />
        </form>
    );
}
