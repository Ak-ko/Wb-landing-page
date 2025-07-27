import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IllustrationArtT } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import IllustrationImageGallery from './illustration-image';

interface IllustrationFormProps {
    illustrationArt?: IllustrationArtT;
}

export default function IllustrationForm({ illustrationArt }: IllustrationFormProps) {
    const [existingImages, setExistingImages] = useState(
        illustrationArt?.images.map((img) => ({
            id: img.id,
            url: `${img.image}`,
            is_primary: img.is_primary,
        })) || [],
    );

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        title: illustrationArt?.title || '',
        description: illustrationArt?.description || '',
        images: illustrationArt?.images?.map((illustration) => illustration?.image) || ([] as string[]),
        new_images: [],
        removed_images: [] as number[],
    });

    const [newImages, setNewImages] = useState<{ file: string | File; url: string; is_primary: boolean }[]>([]);

    const handleImageUpload = (file: File | string, isPrimary = false) => {
        if (typeof file === 'string') {
            const newImage = {
                file,
                url: `/storage/${file}`,
                is_primary: isPrimary,
            };

            setNewImages((prev) => [...prev, newImage]);

            setData('images', [...data.images, file]);
        }
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = illustrationArt ? route('illustration-art.update', illustrationArt.id) : route('illustration-art.store');

        transform((data) => ({
            ...data,
            new_images: newImages.map((img) => img.file),
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
                <IllustrationImageGallery
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
                    isEditing={true}
                />
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
        </form>
    );
}
