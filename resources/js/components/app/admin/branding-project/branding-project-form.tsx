/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { BrandingProjectT, TagT } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import BrandingProjectImageGallery from './branding-project-image-gallery';

interface BrandingProjectFormProps {
    brandingProject?: BrandingProjectT;
    tags: TagT[];
    onSuccess: () => void;
    onSubmit?: (data: FormData) => void;
}

export default function BrandingProjectForm({ brandingProject, tags, onSuccess, onSubmit }: BrandingProjectFormProps) {
    const [selectedTags, setSelectedTags] = useState<number[]>(brandingProject?.tags.map((tag) => tag.id) || []);

    const { data, setData, post, put, processing, errors, reset, setError } = useForm({
        title: brandingProject?.title || '',
        description: brandingProject?.description || '',
        client_company: brandingProject?.client_company || '',
        client_name: brandingProject?.client_name || '',
        client_email: brandingProject?.client_email || '',
        client_phone: brandingProject?.client_phone || '',
        service_fees: brandingProject?.service_fees || '',
        service_start_date: brandingProject?.service_start_date || '',
        service_end_date: brandingProject?.service_end_date || '',
        tags: brandingProject?.tags.map((tag) => tag.id) || [],
        images: [] as File[],
        removed_images: [] as number[],
        primary_image_id: brandingProject?.images.find((img) => img.is_primary)?.id || null,
        primary_image_index: null as number | null,
    });

    const [existingImages, setExistingImages] = useState(
        brandingProject?.images.map((img) => ({
            id: img.id,
            url: `/storage/${img.image}`,
            is_primary: img.is_primary,
        })) || [],
    );

    const [newImages, setNewImages] = useState<{ file: string | File; url: string; is_primary: boolean }[]>([]);

    // Helper function to update primary image status
    const updatePrimaryImageStatus = (isPrimary: boolean, targetId?: number | null, isNew = false) => {
        if (isPrimary) {
            // Reset primary status on existing images
            setExistingImages((prev) =>
                prev.map((img) => ({
                    ...img,
                    is_primary: !isNew && targetId !== null ? img.id === targetId : false,
                })),
            );

            // Reset primary status on new images
            setNewImages((prev) =>
                prev.map((img, i) => ({
                    ...img,
                    is_primary: isNew && targetId !== null ? i === targetId : false,
                })),
            );

            // Update form data
            if (!isNew && targetId !== null) {
                // @ts-expect-error @ts-ignore
                setData('primary_image_id', targetId);
                setData('primary_image_index', null);
            } else if (isNew && targetId !== null) {
                setData('primary_image_id', null);
                // @ts-expect-error @ts-ignore
                setData('primary_image_index', targetId);
            }
        }
    };

    const handleTagToggle = (tagId: number) => {
        const newSelectedTags = selectedTags.includes(tagId) ? selectedTags.filter((id) => id !== tagId) : [...selectedTags, tagId];
        setSelectedTags(newSelectedTags);
        setData('tags', newSelectedTags);
    };

    const handleImageUpload = (file: File | string, isPrimary = false) => {
        // If it's a string (path from chunked upload), handle it differently
        if (typeof file === 'string') {
            // Create a new image entry with the path
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

            // @ts-expect-error @ts-ignore
            setData('images', [...data.images, file]);
        } else {
            // Handle File object
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    file,
                    url: e.target?.result as string,
                    is_primary: isPrimary,
                };

                const newIndex = newImages.length;
                setNewImages((prev) => [...prev, newImage]);

                // Update primary image status if needed
                if (isPrimary) {
                    updatePrimaryImageStatus(true, newIndex, true);
                }
            };
            reader.readAsDataURL(file);

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

        // Validate required fields
        const validationErrors: Record<string, string> = {};
        if (!data.title.trim()) {
            validationErrors.title = 'Project title is required';
        }

        if (!data.client_company.trim()) {
            validationErrors.client_company = 'Client company is required';
        }

        if (existingImages.length === 0 && newImages.length === 0) {
            validationErrors.images = 'At least one project image is required';
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

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'images') {
                (value as Array<File | string>).forEach((file) => {
                    formData.append('images[]', file);
                });
            } else if (key === 'tags') {
                (value as number[]).forEach((tagId) => {
                    formData.append('tags[]', tagId.toString());
                });
            } else if (key === 'removed_images') {
                (value as number[]).forEach((imageId) => {
                    formData.append('removed_images[]', imageId.toString());
                });
            } else if (value !== null && value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        // If a new image is set as primary, add the primary_image_index
        const primaryNewImage = newImages.findIndex((img) => img.is_primary);
        if (primaryNewImage !== -1) {
            formData.append('primary_image_index', primaryNewImage.toString());
        }

        const url = brandingProject ? route('branding-projects.update', brandingProject.id) : route('branding-projects.store');

        if (onSubmit) {
            onSubmit(formData);
            return;
        }

        if (brandingProject) {
            formData.append('_method', 'PUT');
            post(url, {
                // @ts-expect-error @ts-ignore
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    onSuccess();
                },
            });
        } else {
            post(url, {
                // @ts-expect-error @ts-ignore
                data: formData,
                forceFormData: true,
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
                    Project Title <span className="text-red-500">*</span>
                </label>
                <Input id="title" placeholder="Enter project title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <Textarea
                    id="description"
                    placeholder="Enter project description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="client_company" className="block text-sm font-medium">
                    Client Company<span className="text-red-500">*</span>
                </label>
                <Input
                    id="client_company"
                    placeholder="Enter client company name"
                    value={data.client_company}
                    onChange={(e) => setData('client_company', e.target.value)}
                />
                {errors.client_company && <p className="text-sm text-red-500">{errors.client_company}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <label htmlFor="client_name" className="block text-sm font-medium">
                        Client Name
                    </label>
                    <Input
                        id="client_name"
                        placeholder="Enter client name"
                        value={data.client_name}
                        onChange={(e) => setData('client_name', e.target.value)}
                    />
                    {errors.client_name && <p className="text-sm text-red-500">{errors.client_name}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="client_email" className="block text-sm font-medium">
                        Client Email
                    </label>
                    <Input
                        id="client_email"
                        type="email"
                        placeholder="Enter client email"
                        value={data.client_email}
                        onChange={(e) => setData('client_email', e.target.value)}
                    />
                    {errors.client_email && <p className="text-sm text-red-500">{errors.client_email}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="client_phone" className="block text-sm font-medium">
                        Client Phone
                    </label>
                    <Input
                        id="client_phone"
                        placeholder="Enter client phone"
                        value={data.client_phone}
                        onChange={(e) => setData('client_phone', e.target.value)}
                    />
                    {errors.client_phone && <p className="text-sm text-red-500">{errors.client_phone}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="service_fees" className="block text-sm font-medium">
                    Service Fees
                </label>
                <Input
                    id="service_fees"
                    type="number"
                    step="0.01"
                    placeholder="Enter service fees"
                    value={data.service_fees}
                    onChange={(e) => setData('service_fees', e.target.value)}
                />
                {errors.service_fees && <p className="text-sm text-red-500">{errors.service_fees}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Service Start Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn('w-full justify-start text-left font-normal', !data.service_start_date && 'text-muted-foreground')}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.service_start_date ? format(new Date(data.service_start_date), 'PPP') : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={data.service_start_date ? new Date(data.service_start_date) : undefined}
                                onSelect={(date: any) => setData('service_start_date', date ? date.toISOString() : '')}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.service_start_date && <p className="text-sm text-red-500">{errors.service_start_date}</p>}
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Service End Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn('w-full justify-start text-left font-normal', !data.service_end_date && 'text-muted-foreground')}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.service_end_date ? format(new Date(data.service_end_date), 'PPP') : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={data.service_end_date ? new Date(data.service_end_date) : undefined}
                                onSelect={(date: any) => setData('service_end_date', date ? date.toISOString() : '')}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.service_end_date && <p className="text-sm text-red-500">{errors.service_end_date}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Project Images <span className="text-red-500">*</span>
                </label>
                <BrandingProjectImageGallery
                    images={allImages}
                    onImageUpload={handleImageUpload}
                    onImageDelete={(imageId) => {
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
                    {brandingProject ? 'Update Project' : 'Create Project'}
                </Button>
            </div>
        </form>
    );
}
