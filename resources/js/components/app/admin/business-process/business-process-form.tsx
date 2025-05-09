import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

import ImageUploader from '@/components/common/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { BusinessProcessT } from '@/types';
import ColorSuggestions from '../../color-suggestions';

interface BusinessProcessFormProps {
    businessProcess?: BusinessProcessT;
    onSuccess: () => void;
}

export default function BusinessProcessForm({ businessProcess, onSuccess }: BusinessProcessFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: businessProcess?.title || '',
        description: businessProcess?.description || '',
        image: businessProcess?.image || '',
        color_tag: businessProcess?.color_tag || '#000000',
        step: businessProcess?.step || '',
        is_active: businessProcess?.is_active ?? true,
    });

    const [isImageUploading, setIsImageUploading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentImageUrl, setCurrentImageUrl] = useState<string>(businessProcess?.image || '');
    const props = usePage<{ ziggy: { url: string } }>().props;

    const handleImageChange = async (file: File | string) => {
        if (typeof file === 'string') {
            setData('image', file);
            setCurrentImageUrl(`${props?.ziggy?.url}/storage/${file}`);
        }
    };

    const handleUploadStateChange = (state: 'idle' | 'uploading' | 'paused' | 'error' | 'completed') => {
        setIsImageUploading(state === 'uploading' || state === 'paused');
    };

    const handleColorSelect = (color: string) => {
        setData('color_tag', color);
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
        <form onSubmit={handleSubmit} className="hide-scrollbar !max-h-[650px] space-y-6 !overflow-y-auto">
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                    Title
                </label>
                <Input id="title" placeholder="Enter title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="step" className="block text-sm font-medium">
                    Step Number
                </label>
                <Input
                    id="step"
                    type="number"
                    placeholder="Enter step number (e.g., 1, 2, 3)"
                    value={data.step}
                    onChange={(e) => setData('step', e.target.value)}
                />
                {errors.step && <p className="text-sm text-red-500">{errors.step}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="color_tag" className="block text-sm font-medium">
                    Color Tag
                </label>
                <div className="flex items-center gap-3">
                    <Input
                        id="color_tag"
                        type="color"
                        value={data.color_tag}
                        onChange={(e) => setData('color_tag', e.target.value)}
                        className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                        type="text"
                        value={data.color_tag}
                        onChange={(e) => setData('color_tag', e.target.value)}
                        placeholder="#000000"
                        className="w-full"
                    />
                    <ColorSuggestions onColorSelect={handleColorSelect} />
                </div>
                <p className="text-xs text-gray-500">Choose a color or select from suggestions</p>
                {errors.color_tag && <p className="text-sm text-red-500">{errors.color_tag}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <Textarea
                    id="description"
                    placeholder="Enter business process description"
                    value={data.description || ''}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="flex items-center space-x-2">
                <Switch id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                <Label htmlFor="is_active">Active</Label>
                {errors.is_active && <p className="text-sm text-red-500">{errors.is_active}</p>}
            </div>

            <ImageUploader
                initialImage={businessProcess?.image}
                onImageChange={handleImageChange}
                onUploadStateChange={handleUploadStateChange}
                onImageRemove={() => {
                    setData('image', '');
                    setCurrentImageUrl('');
                }}
                error={errors.image}
                placeholderText="Click to upload or drag and drop"
                helperText="SVG, PNG, JPG or GIF (max. 300MB)"
            />

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={processing || isImageUploading}>
                    {processing
                        ? 'Saving...'
                        : isImageUploading
                          ? 'Uploading...'
                          : businessProcess
                            ? 'Update Business Process'
                            : 'Create Business Process'}
                </Button>
            </div>
        </form>
    );
}
