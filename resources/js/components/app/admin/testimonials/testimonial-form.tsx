import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

import ImageUploader from '@/components/common/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useImageColor } from '@/hooks/use-image-color';
import { TestimonialT } from '@/types';
import { useState } from 'react';

interface TestimonialFormProps {
    testimonial?: TestimonialT;
    onSuccess: () => void;
}

export default function TestimonialForm({ testimonial, onSuccess }: TestimonialFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: testimonial?.name || '',
        email: testimonial?.email || '',
        phone: testimonial?.phone || '',
        position: testimonial?.position || '',
        company: testimonial?.company || '',
        description: testimonial?.description || '',
        image: testimonial?.image || '',
        color_tag: testimonial?.color_tag || '#000000',
    });

    const [isImageUploading, setIsImageUploading] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState<string>(data.image || '');
    const { dominantColor, isLoading } = useImageColor(currentImageUrl, '#000000');
    const props = usePage<{ ziggy: { url: string } }>().props;

    // Update color_tag when dominant color is extracted
    useEffect(() => {
        if (!isLoading && dominantColor && currentImageUrl) {
            setData('color_tag', dominantColor);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dominantColor, isLoading, currentImageUrl]);

    const handleImageChange = async (file: File | string) => {
        if (typeof file === 'string') {
            setData('image', file);
            setCurrentImageUrl(`${props?.ziggy?.url}/storage/${file}`);
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

        const url = testimonial ? route('testimonials.update', testimonial.id) : route('testimonials.store');

        if (testimonial) {
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
        <form onSubmit={handleSubmit} className="!max-h-[650px] space-y-6 !overflow-y-auto">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                    Name
                </label>
                <Input id="name" placeholder="Enter name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email
                    </label>
                    <Input id="email" type="email" placeholder="Enter email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                        Phone
                    </label>
                    <Input id="phone" placeholder="Enter phone number" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="position" className="block text-sm font-medium">
                        Position
                    </label>
                    <Input id="position" placeholder="Enter position" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                    {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium">
                        Company
                    </label>
                    <Input id="company" placeholder="Enter company" value={data.company} onChange={(e) => setData('company', e.target.value)} />
                    {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                </div>
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
                </div>
                <p className="text-xs text-gray-500">
                    {isLoading && currentImageUrl
                        ? 'Extracting color from image...'
                        : 'Color is automatically extracted from the image, but you can change it manually'}
                </p>
                {errors.color_tag && <p className="text-sm text-red-500">{errors.color_tag}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <Textarea
                    id="description"
                    placeholder="Enter testimonial description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <ImageUploader
                initialImage={testimonial?.image}
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
                <Button type="submit" disabled={processing || isImageUploading || ((currentImageUrl && isLoading) as boolean)}>
                    {processing
                        ? 'Saving...'
                        : isImageUploading
                          ? 'Uploading...'
                          : currentImageUrl && isLoading
                            ? 'Extracting color...'
                            : testimonial
                              ? 'Update Testimonial'
                              : 'Create Testimonial'}
                </Button>
            </div>
        </form>
    );
}
