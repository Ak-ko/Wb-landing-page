import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MascortArtT } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import MascortArtImageGallery from './mascort-art-image-gallery';

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
        })) || [],
    );

    const { data, setData, post, put, processing, errors } = useForm({
        title: mascortArt?.title || '',
        description: mascortArt?.description || '',
        images: [] as string[],
        removed_images: [] as number[],
        new_images: [] as string[],
        primary_image_id: mascortArt?.images.find((img) => img.is_primary)?.id || null,
        mascot_image_id: mascortArt?.images.find((img) => img.is_mascot)?.id || null,
    });

    const [newImages, setNewImages] = useState<{ file: File | string; url: string; is_primary: boolean; is_mascot: boolean }[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mascortArt) {
            put(route('mascort-art.update', mascortArt.id), {
                onSuccess,
            });
        } else {
            post(route('mascort-art.store'), {
                onSuccess,
            });
        }
    };

    const handleImageUpload = (file: File | string, isPrimary: boolean = false, isMascot: boolean = false) => {
        const url = typeof file === 'string' ? file : URL.createObjectURL(file);
        const newImage = { file, url: `/storage/${url}`, is_primary: isPrimary, is_mascot: isMascot };

        if (isPrimary) {
            setNewImages((prev) => prev.map((img) => ({ ...img, is_primary: false })));
            setExistingImages((prev) => prev.map((img) => ({ ...img, is_primary: false })));
            setData('primary_image_id', null);
        }

        if (isMascot) {
            setNewImages((prev) => prev.map((img) => ({ ...img, is_mascot: false })));
            setExistingImages((prev) => prev.map((img) => ({ ...img, is_mascot: false })));
            setData('mascot_image_id', null);
        }

        setNewImages((prev) => [...prev, newImage]);
        setData('new_images', [...newImages.map((n) => n.url), file as string]);
        setData('images', [...data.images, file as string]);
    };

    const handleImageDelete = (imageId: number | string) => {
        if (typeof imageId === 'number') {
            setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
            setData('removed_images', [...data.removed_images, imageId]);

            if (data.primary_image_id === imageId) {
                setData('primary_image_id', null);
            }
            if (data.mascot_image_id === imageId) {
                setData('mascot_image_id', null);
            }
        } else {
            const index = newImages.findIndex((img) => img.url === imageId);
            if (index !== -1) {
                const newImagesList = [...newImages];
                newImagesList.splice(index, 1);
                setNewImages(newImagesList);

                const newFilesList = [...data.images];
                newFilesList.splice(index, 1);
                setData('images', newFilesList);
            }
        }
    };

    const handleSetPrimaryImage = (imageId: number | string) => {
        if (typeof imageId === 'number') {
            setExistingImages((prev) =>
                prev.map((img) => ({
                    ...img,
                    is_primary: img.id === imageId,
                })),
            );
            setNewImages((prev) => prev.map((img) => ({ ...img, is_primary: false })));
            setData('primary_image_id', imageId);
        } else {
            setNewImages((prev) =>
                prev.map((img) => ({
                    ...img,
                    is_primary: img.url === imageId,
                })),
            );
            setExistingImages((prev) => prev.map((img) => ({ ...img, is_primary: false })));
            setData('primary_image_id', null);
        }
    };

    const handleSetMascotImage = (imageId: number | string) => {
        if (typeof imageId === 'number') {
            setExistingImages((prev) =>
                prev.map((img) => ({
                    ...img,
                    is_mascot: img.id === imageId,
                })),
            );
            setNewImages((prev) => prev.map((img) => ({ ...img, is_mascot: false })));
            setData('mascot_image_id', imageId);
        } else {
            setNewImages((prev) =>
                prev.map((img) => ({
                    ...img,
                    is_mascot: img.url === imageId,
                })),
            );
            setExistingImages((prev) => prev.map((img) => ({ ...img, is_mascot: false })));
            setData('mascot_image_id', null);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="title">
                        Title <span className="text-red-500">*</span>
                    </Label>
                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Enter mascot art title" />
                    {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                </div>

                <div className="grid w-full gap-1.5">
                    <Label htmlFor="description">
                        Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Enter mascot art description"
                    />
                    {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
                </div>

                <div className="grid w-full gap-1.5">
                    <Label>
                        Images <span className="text-red-500">*</span>
                    </Label>
                    <MascortArtImageGallery
                        images={[...existingImages, ...newImages]}
                        onImageUpload={handleImageUpload}
                        onImageDelete={handleImageDelete}
                        onSetPrimaryImage={handleSetPrimaryImage}
                        onSetMascotImage={handleSetMascotImage}
                        isEditing={!!mascortArt}
                    />
                    {errors.images && <p className="text-destructive text-sm">{errors.images}</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : mascortArt ? 'Update Mascot Art' : 'Create Mascot Art'}
                </Button>
            </div>
        </form>
    );
}
