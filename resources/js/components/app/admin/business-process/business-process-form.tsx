import { ColorInput } from '@/components/common/color-input';
import ImageUploader from '@/components/common/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BusinessProcessT } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface BusinessProcessFormProps {
    businessProcess?: BusinessProcessT;
    onSuccess: () => void;
}

export default function BusinessProcessForm({ businessProcess, onSuccess }: BusinessProcessFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: businessProcess?.title || '',
        subtitle: businessProcess?.subtitle || '',
        description: businessProcess?.description || '',
        image: businessProcess?.image || '',
        color_tag: businessProcess?.color_tag || '#000000',
        text_color: businessProcess?.text_color || '#ffffff',
        step: businessProcess?.step || '',
        is_active: businessProcess?.is_active ?? true,
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

        const url = businessProcess ? route('business-processes.update', businessProcess.id) : route('business-processes.store');

        if (businessProcess) {
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
                <label htmlFor="title" className="block text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                </label>
                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="subtitle" className="block text-sm font-medium">
                    Subtitle
                </label>
                <Input id="subtitle" value={data.subtitle} onChange={(e) => setData('subtitle', e.target.value)} />
                {errors.subtitle && <p className="text-sm text-red-500">{errors.subtitle}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="step" className="block text-sm font-medium">
                    Step <span className="text-red-500">*</span>
                </label>
                <Input id="step" type="number" value={data.step} onChange={(e) => setData('step', e.target.value)} />
                {errors.step && <p className="text-sm text-red-500">{errors.step}</p>}
            </div>

            <ColorInput
                label="Color Tag"
                backgroundColor={data.color_tag}
                textColor={data.text_color}
                onBackgroundColorChange={(value) => setData('color_tag', value)}
                onTextColorChange={(value) => setData('text_color', value)}
                backgroundColorError={errors.color_tag}
                textColorError={errors.text_color}
            />

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <Textarea
                    id="description"
                    placeholder="Enter creative process description"
                    value={data.description || ''}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <ImageUploader
                initialImage={businessProcess?.image}
                onImageChange={handleImageChange}
                onUploadStateChange={handleUploadStateChange}
                onImageRemove={() => {
                    setData('image', '');
                }}
                error={errors.image}
                placeholderText="Click to upload or drag and drop"
                helperText="SVG, PNG, JPG or GIF (max. 300MB)"
            />

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={processing || isImageUploading}>
                    {processing ? 'Saving...' : isImageUploading ? 'Uploading...' : businessProcess ? 'Update Process' : 'Create Process'}
                </Button>
            </div>
        </form>
    );
}
