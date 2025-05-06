import { useForm } from '@inertiajs/react';

import ImageUploader from '@/components/common/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BrandT } from '@/types';
import { useState } from 'react';

interface BrandFormProps {
    brand?: BrandT;
    onSuccess: () => void;
}

export default function BrandForm({ brand, onSuccess }: BrandFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: brand?.name || '',
        image: brand?.image || '',
        description: brand?.description || '',
    });

    const [isImageUploading, setIsImageUploading] = useState(false);

    const handleImageChange = async (file: File | string) => {
        if (typeof file === 'string') {
            setData('image', file);
        }
    };

    const handleUploadStateChange = (state: 'idle' | 'uploading' | 'paused' | 'error' | 'completed') => {
        setIsImageUploading(state === 'uploading' || state === 'paused');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isImageUploading) {
            return;
        }

        const url = brand ? route('brands.update', brand.id) : route('brands.store');

        if (brand) {
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                    Brand Name
                </label>
                <Input id="name" placeholder="Enter brand name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <Textarea
                    id="description"
                    placeholder="Enter brand description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <ImageUploader
                initialImage={brand?.image}
                onImageChange={handleImageChange}
                onUploadStateChange={handleUploadStateChange}
                onImageRemove={() => setData('image', '')}
                error={errors.image}
                placeholderText="Click to upload or drag and drop"
                helperText="SVG, PNG, JPG or GIF (max. 300MB)"
            />

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={processing || isImageUploading}>
                    {processing ? 'Saving...' : isImageUploading ? 'Uploading...' : brand ? 'Update Brand' : 'Create Brand'}
                </Button>
            </div>
        </form>
    );
}
