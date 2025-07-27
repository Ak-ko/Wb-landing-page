import FormField from '@/components/common/form-field';
import ImageDialog from '@/components/common/image-dialog';
import ImageGallery from '@/components/common/image-gallery';
import MultiImageUploader from '@/components/common/multi-image-upload';
import TagSelector from '@/components/common/tag-selector';
import { Button } from '@/components/ui/button';
import { ColorInput } from '@/components/ui/color-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { shouldBePrimaryImage } from '@/lib/utils';
import { BlogT, TagT } from '@/types';
import { ImageItem, NewImage } from '@/types/common';
import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface BlogFormProps {
    blog?: BlogT;
    tags: TagT[];
    onSuccess: () => void;
}

export default function BlogForm({ blog, tags, onSuccess }: BlogFormProps) {
    const [selectedTags, setSelectedTags] = useState<number[]>(blog?.tags.map((tag) => tag.id) || []);
    const [existingImages, setExistingImages] = useState(
        blog?.images.map((img) => ({
            id: img.id,
            url: `${img.image}`,
            is_primary: img.is_primary,
        })) || [],
    );
    const [newImages, setNewImages] = useState<NewImage[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        title: blog?.title || '',
        description: blog?.description || '',
        is_published: blog?.is_published ?? true,
        tags: blog?.tags.map((tag) => tag.id) || [],
        color: blog?.color || '#3b82f6',
        images: blog?.images?.map((blogImage) => blogImage?.image) || ([] as string[]),
        new_images: [],
        removed_images: [] as number[],
        primary_image_id: blog?.images.find((img) => img.is_primary)?.id || null,
        primary_image_index: null as number | null,
    });

    const displayImages = useMemo(() => {
        return [
            ...existingImages,
            ...newImages.map((img, index) => ({
                id: `new-${index}`,
                url: img.url,
                is_primary: img.is_primary,
                isNew: true,
                file: img.file,
            })),
        ];
    }, [existingImages, newImages]);

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

    const handleTagToggle = (tagId: number) => {
        const newSelectedTags = selectedTags.includes(tagId) ? selectedTags.filter((id) => id !== tagId) : [...selectedTags, tagId];
        setSelectedTags(newSelectedTags);
        setData('tags', newSelectedTags);
    };

    const updateNewImagesWithPrimary = (newImage: NewImage) => {
        setNewImages((prev) => {
            const updatedImages = prev.map((img) => ({ ...img, is_primary: false }));
            return [...updatedImages, newImage];
        });
    };

    const handleImageUpload = (file: File | string, index?: number, total?: number, isPrimary = false) => {
        if (typeof file !== 'string') return;

        const currentNewImagesLength = newImages.length;
        const currentExistingImagesLength = existingImages.length;
        const primary = shouldBePrimaryImage(currentNewImagesLength, currentExistingImagesLength, isPrimary, index, total);

        const newImage = {
            file,
            url: `/storage/${file}`,
            is_primary: primary,
        };

        const newIndex = currentNewImagesLength;

        if (primary) {
            setData('primary_image_index', newIndex);
            updateNewImagesWithPrimary(newImage);
        } else {
            setNewImages((prev) => [...prev, newImage]);
        }

        setData('images', [...data.images, file]);
    };

    const handleImageUploadForGallery = (file: File | string, isPrimary = false) => {
        handleImageUpload(file, undefined, undefined, isPrimary);
    };

    const handleRemoveExistingImage = (imageId: number) => {
        const isRemovingPrimary = existingImages.find((img) => img.id === imageId)?.is_primary || false;

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
    };

    const handleRemoveNewImage = (index: number) => {
        const isRemovingPrimary = newImages[index]?.is_primary || false;

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
    };

    const handleSetPrimaryImage = (imageId: number | string) => {
        if (typeof imageId === 'number') {
            updatePrimaryImageStatus(true, imageId, false);
        } else if (typeof imageId === 'string' && imageId.startsWith('new-')) {
            const index = parseInt(imageId.replace('new-', ''), 10);
            updatePrimaryImageStatus(true, index, true);
        }
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
                        is_primary: img.is_primary as boolean,
                    });
                }
            } else if (typeof img.id === 'string' && img.id.startsWith('new-')) {
                const newImage = newImagesMap.get(img.id);
                if (newImage) {
                    reorderedNew.push({
                        ...newImage,
                        is_primary: img.is_primary as boolean,
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
            const newImg = img as { id: string; url: string; is_primary: boolean; isNew: boolean; file: string | File };
            return typeof newImg.file === 'string' ? newImg.file : (newImg.url || '').replace('/storage/', '');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = blog ? route('blogs.update', blog.id) : route('blogs.store');

        const reorderedImagePaths = displayImages.map(getImagePath);

        const reorderedNewImages = displayImages
            .filter(
                (img): img is { id: string; url: string; is_primary: boolean; isNew: boolean; file: string | File } => 'isNew' in img && img.isNew,
            )
            .map((img) => ({
                file: typeof img.file === 'string' ? img.file : img.url.replace('/storage/', ''),
                is_primary: img.is_primary,
            }));

        transform((data) => ({
            ...data,
            images: reorderedImagePaths,
            new_images: reorderedNewImages,
        }));

        if (blog) {
            put(url, { onSuccess });
        } else {
            post(url, {
                onSuccess: () => {
                    reset();
                    onSuccess();
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
            <FormField label="Blog Title" required error={errors.title}>
                <Input placeholder="Enter blog title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
            </FormField>

            <FormField label="Description" error={errors.description}>
                <Textarea
                    placeholder="Enter blog description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                />
            </FormField>

            <ColorInput label="Blog Color" value={data.color} onChange={(value) => setData('color', value)} error={errors.color} />

            <div className="flex items-center space-x-2">
                <Switch id="is_published" checked={data.is_published} onCheckedChange={(checked) => setData('is_published', checked)} />
                <Label htmlFor="is_published">Published</Label>
                {errors.is_published && <p className="text-sm text-red-500">{errors.is_published}</p>}
            </div>

            <FormField label="Blog Images" required error={errors.images}>
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
                            allowDrag={!!blog}
                        />
                    </div>
                )}
            </FormField>

            <TagSelector tags={tags} selectedTags={selectedTags} onTagToggle={handleTagToggle} error={errors.tags} required />

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {blog ? 'Update Blog' : 'Create Blog'}
                </Button>
            </div>

            <ImageDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                image={selectedImage || undefined}
                onDelete={handleImageDelete}
                onSetPrimary={handleSetPrimaryImage}
                onUpload={handleImageUploadForGallery}
                isEditing={true}
            />
        </form>
    );
}
