import { useForm } from '@inertiajs/react';
import { useState } from 'react';

import ImageUploader from '@/components/common/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface ProjectShowcase {
    id: number;
    content: string;
    image: string;
    is_featured: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

interface ProjectShowcaseFormProps {
    projectShowcase?: ProjectShowcase;
    onSuccess: () => void;
}

export default function ProjectShowcaseForm({ projectShowcase, onSuccess }: ProjectShowcaseFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        content: projectShowcase?.content || '',
        image: projectShowcase?.image || '',
        is_featured: projectShowcase?.is_featured || false,
        order: projectShowcase?.order || 0,
    });

    const [isImageUploading, setIsImageUploading] = useState(false);

    const handleImageChange = (file: File | string) => {
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

        const url = projectShowcase ? route('project-showcases.update', projectShowcase.id) : route('project-showcases.store');

        if (projectShowcase) {
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
                <Label htmlFor="content">Content</Label>
                <Textarea
                    id="content"
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    placeholder="Enter the content for this showcase"
                    className={errors.content ? 'border-red-500' : ''}
                    rows={4}
                />
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <ImageUploader
                    initialImage={data.image ? `/storage/${data.image}` : null}
                    onImageChange={handleImageChange}
                    onUploadStateChange={handleUploadStateChange}
                    onImageRemove={() => setData('image', '')}
                    error={errors.image}
                    aspectRatio="aspect-video"
                    placeholderText="Click to upload or drag and drop"
                    helperText="SVG, PNG, JPG or GIF (max. 300 MB)"
                    labelText="Image"
                />
                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                    id="order"
                    type="number"
                    value={data.order}
                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.order ? 'border-red-500' : ''}
                />
                {errors.order && <p className="text-sm text-red-500">{errors.order}</p>}
            </div>

            <div className="flex items-center space-x-2">
                <Switch id="is_featured" checked={data.is_featured} onCheckedChange={(checked) => setData('is_featured', checked)} />
                <Label htmlFor="is_featured">Featured</Label>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={processing || isImageUploading}>
                    {processing
                        ? 'Saving...'
                        : isImageUploading
                          ? 'Uploading...'
                          : projectShowcase
                            ? 'Update Project Showcase'
                            : 'Create Project Showcase'}
                </Button>
            </div>
        </form>
    );
}
