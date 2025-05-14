import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { BlogT, TagT } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import ColorSuggestions from '../../color-suggestions';
import BlogImageGallery from './blog-image-gallery';

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

    const { data, setData, post, put, processing, errors, reset, setError } = useForm({
        title: blog?.title || '',
        description: blog?.description || '',
        is_published: blog?.is_published ?? true,
        tags: blog?.tags.map((tag) => tag.id) || [],
        color: blog?.color || '#3b82f6',
        images: blog?.images?.map((blogImage) => blogImage?.image) || ([] as string[]),
        removed_images: [] as number[],
        primary_image_id: blog?.images.find((img) => img.is_primary)?.id || null,
        primary_image_index: null as number | null,
    });

    const [newImages, setNewImages] = useState<{ file: string | File; url: string; is_primary: boolean }[]>([]);

    const handleColorSelect = (color: string) => {
        setData('color', color);
    };

    const updatePrimaryImageStatus = (isPrimary: boolean, targetId?: number | null, isNew = false) => {
        if (isPrimary) {
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
        }
    };

    const handleTagToggle = (tagId: number) => {
        const newSelectedTags = selectedTags.includes(tagId) ? selectedTags.filter((id) => id !== tagId) : [...selectedTags, tagId];
        setSelectedTags(newSelectedTags);
        setData('tags', newSelectedTags);
    };

    const handleImageUpload = (file: File | string, isPrimary = false) => {
        if (typeof file === 'string') {
            const newImage = {
                file,
                url: `/storage/${file}`,
                is_primary: isPrimary,
            };

            const newIndex = newImages.length;
            setNewImages((prev) => [...prev, newImage]);

            if (isPrimary) {
                updatePrimaryImageStatus(true, newIndex, true);
            }

            setData('images', [...data.images, file]);
        }
    };

    const handleRemoveExistingImage = (imageId: number) => {
        const isRemovingPrimary = existingImages.find((img) => img.id === imageId)?.is_primary || false;

        // Remove the image from state
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        setData('removed_images', [...data.removed_images, imageId]);

        // If we're removing the primary image, set a new one if available
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

        // Remove the image from state
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setData(
            'images',
            data.images.filter((_, i) => i !== index),
        );

        // If we're removing the primary image, set a new one if available
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors: Record<string, string> = {};
        if (!data.title.trim()) {
            validationErrors.title = 'Blog title is required';
        }

        if (existingImages.length === 0 && newImages.length === 0) {
            validationErrors.images = 'At least one blog image is required';
        }

        if (data.tags.length === 0) {
            validationErrors.tags = 'At least one tag must be selected';
        }

        if (Object.keys(validationErrors).length > 0) {
            for (const [key, value] of Object.entries(validationErrors)) {
                setError(key as keyof typeof data, value);
            }
            return;
        }

        const url = blog ? route('blogs.update', blog.id) : route('blogs.store');

        if (blog) {
            put(url, {
                onSuccess: () => {
                    onSuccess();
                },
            });
        } else {
            post(url, {
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        }
    };

    const allImages = [
        ...existingImages,
        ...newImages.map((img, index) => ({
            id: `new-${index}`,
            url: img.url,
            is_primary: img.is_primary,
            isNew: true,
        })),
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                    Blog Title <span className="text-red-500">*</span>
                </label>
                <Input id="title" placeholder="Enter blog title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <Textarea
                    id="description"
                    placeholder="Enter blog description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="color" className="block text-sm font-medium">
                    Blog Color
                </label>
                <div className="flex items-center gap-3">
                    <Input id="color" type="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className="h-10 w-20" />
                    <Input
                        type="text"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        placeholder="#HEX color"
                        className="flex-1"
                    />
                    <ColorSuggestions onColorSelect={handleColorSelect} />
                </div>
                <p className="text-xs text-gray-500">Choose a color or select from suggestions</p>
                {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="is_published"
                    checked={data.is_published}
                    onCheckedChange={(checked) => {
                        setData('is_published', checked);
                    }}
                />
                <Label htmlFor="is_published">Published</Label>
                {errors.is_published && <p className="text-sm text-red-500">{errors.is_published}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Blog Images <span className="text-red-500">*</span>
                </label>
                <BlogImageGallery
                    images={allImages}
                    onImageUpload={handleImageUpload}
                    onImageDelete={(imageId: number | string) => {
                        if (typeof imageId === 'number') {
                            handleRemoveExistingImage(imageId);
                        } else if (typeof imageId === 'string' && imageId.startsWith('new-')) {
                            const index = parseInt(imageId.replace('new-', ''), 10);
                            handleRemoveNewImage(index);
                        }
                    }}
                    onSetPrimaryImage={handleSetPrimaryImage}
                    isEditing={true}
                />
                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
            </div>

            {tags?.length > 0 && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Tags <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {tags?.map((tag) => (
                            <Badge
                                key={tag.id}
                                style={{
                                    backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                                    color: selectedTags.includes(tag.id) ? 'white' : 'black',
                                }}
                                className={cn('cursor-pointer border', selectedTags.includes(tag.id) ? 'border-transparent' : 'border-gray-300')}
                                onClick={() => handleTagToggle(tag.id)}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                    {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                </div>
            )}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {blog ? 'Update Blog' : 'Create Blog'}
                </Button>
            </div>
        </form>
    );
}
