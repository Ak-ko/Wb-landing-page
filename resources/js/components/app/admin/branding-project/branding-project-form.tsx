/* eslint-disable @typescript-eslint/no-unused-vars */

import MultiImageUploader from '@/components/common/multi-image-upload';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn, shouldBePrimaryImage } from '@/lib/utils';
import { BrandingProjectMemberT, BrandingProjectT, TagT, TeamMemberT } from '@/types';
import { ImageItem, NewImage } from '@/types/common';
import { useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import ProjectLeadCard from '../../project-lead-card';
import BrandingProjectImageGallery from './branding-project-image-gallery';

interface BrandingProjectFormProps {
    brandingProject?: BrandingProjectT;
    tags: TagT[];
    onSubmit?: (data: FormData) => void;
}

export default function BrandingProjectForm({ brandingProject, tags, onSubmit }: BrandingProjectFormProps) {
    const [selectedTags, setSelectedTags] = useState<number[]>(brandingProject?.tags.map((tag) => tag.id) || []);
    const { teamMembers } = usePage<{ teamMembers: TeamMemberT[] }>().props;

    const [existingImages, setExistingImages] = useState(
        brandingProject?.images.map((img) => ({
            id: img.id,
            url: `${img.image}`,
            is_primary: img.is_primary,
        })) || [],
    );

    const [newImages, setNewImages] = useState<NewImage[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        title: brandingProject?.title || '',
        description: brandingProject?.description || '',
        client_company: brandingProject?.client_company || '',
        client_name: brandingProject?.client_name || '',
        client_email: brandingProject?.client_email || '',
        client_phone: brandingProject?.client_phone || '',
        client_origin: brandingProject?.client_origin || '',
        service_fees: brandingProject?.service_fees || 0,
        year: brandingProject?.year || '',
        industry_type: brandingProject?.industry_type || '',
        project_keywords: brandingProject?.project_keywords || '',
        project_scopes: brandingProject?.project_scopes || '',
        project_link: brandingProject?.project_link || '',
        tags: brandingProject?.tags.map((tag) => tag.id) || [],
        is_published: brandingProject?.is_published || (true as boolean),
        images: brandingProject?.images?.map((brandingProjectImage) => brandingProjectImage?.image) || ([] as string[]),
        new_images: [],
        removed_images: [] as number[],
        primary_image_id: brandingProject?.images.find((img) => img.is_primary)?.id || null,
        primary_image_index: null as number | null,
        project_members:
            brandingProject?.members.map((value) => ({
                branding_project_id: brandingProject?.id || null,
                team_member_id: value.id,
                is_lead: !!value?.pivot?.is_lead,
            })) || ([] as BrandingProjectMemberT[] | null),
    });

    const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMemberT[]>(brandingProject?.members || []);

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

    const handleChangeProjectMembers = (values: MultiValue<TeamMemberT>) => {
        const valuesArr = values.map((value) => ({
            branding_project_id: brandingProject?.id || null,
            team_member_id: value.id,
            is_lead: !!value?.pivot?.is_lead || false,
        }));

        setData('project_members', valuesArr as BrandingProjectMemberT[]);

        setSelectedTeamMembers(values as TeamMemberT[]);
    };

    const handleLeadChange = (selectedTeamMember: TeamMemberT, checked: boolean) => {
        const updatedMembers = data?.project_members?.map(
            (member: { team_member_id: number; is_lead: boolean; branding_project_id: number | null }) => {
                if (member?.team_member_id === selectedTeamMember?.id) {
                    return { ...member, is_lead: checked };
                }
                return member;
            },
        );

        setData('project_members', updatedMembers as BrandingProjectMemberT[]);
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

        const reorderedExistingImages: typeof existingImages = [];
        const reorderedNewImages: typeof newImages = [];

        reorderedImages.forEach((img) => {
            if (typeof img.id === 'number') {
                const existingImg = existingImagesMap.get(img.id);
                if (existingImg) {
                    reorderedExistingImages.push(existingImg);
                }
            } else if (typeof img.id === 'string' && img.id.startsWith('new-')) {
                const index = parseInt(img.id.replace('new-', ''), 10);
                const newImg = newImagesMap.get(img.id);
                if (newImg) {
                    reorderedNewImages.push(newImg);
                }
            }
        });

        setExistingImages(reorderedExistingImages);
        setNewImages(reorderedNewImages);
    };

    const getImagePath = (img: ImageItem) => {
        if (img.isNew && img.file) {
            return typeof img.file === 'string' ? img.file : img.url;
        }
        return img.url;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = brandingProject ? route('branding-projects.update', brandingProject.id) : route('branding-projects.store');

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

        if (brandingProject) {
            put(url);
        } else {
            post(url);
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="rounded-xl border p-5">
                <legend className="font-bold">Project Information</legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium">
                            Project Title <span className="text-red-500">*</span>
                        </label>
                        <Input id="title" placeholder="Enter project title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="project_keywords" className="block text-sm font-medium">
                            Project Keywords<span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="project_keywords"
                            type="text"
                            placeholder="Enter Project Keywords"
                            value={data.project_keywords}
                            onChange={(e) => setData('project_keywords', e.target.value)}
                        />
                        {errors.project_keywords && <p className="text-sm text-red-500">{errors.project_keywords}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="year" className="block text-sm font-medium">
                            Year<span className="text-red-500">*</span>
                        </label>
                        <Input id="year" type="number" placeholder="Enter year" value={data.year} onChange={(e) => setData('year', e.target.value)} />
                        {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="industry_type" className="block text-sm font-medium">
                            Industry<span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="industry_type"
                            type="text"
                            placeholder="Enter Industry"
                            value={data.industry_type}
                            onChange={(e) => setData('industry_type', e.target.value)}
                        />
                        {errors.industry_type && <p className="text-sm text-red-500">{errors.industry_type}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="project_scopes" className="block text-sm font-medium">
                            Project Scopes<span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="project_scopes"
                            placeholder="Enter Project Scopes"
                            value={data.project_scopes}
                            onChange={(e) => setData('project_scopes', e.target.value)}
                        />
                        {errors.project_scopes && <p className="text-sm text-red-500">{errors.project_scopes}</p>}
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
                        <label htmlFor="project_link" className="block text-sm font-medium">
                            Behance Link<span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="project_link"
                            type="text"
                            placeholder="Enter Link"
                            value={data.project_link}
                            onChange={(e) => setData('project_link', e.target.value)}
                        />
                        {errors.project_link && <p className="text-sm text-red-500">{errors.project_link}</p>}
                    </div>

                    <div className="col-span-2 space-y-2">
                        <label htmlFor="project_members" className="block text-sm font-medium">
                            Project Members
                        </label>
                        <Select
                            className="rounded-2xl border-0 shadow-xs"
                            options={teamMembers}
                            value={selectedTeamMembers}
                            isMulti
                            getOptionValue={(o) => o.id?.toString()}
                            getOptionLabel={(o) => o.name}
                            onChange={(values) => {
                                handleChangeProjectMembers(values);
                            }}
                        />
                        {errors.project_members && <p className="text-sm text-red-500">{errors.project_members}</p>}
                    </div>

                    <div className="col-span-2 space-y-2">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {selectedTeamMembers?.map((selectedTeamMember: TeamMemberT) => (
                                <ProjectLeadCard key={selectedTeamMember?.id} selectedTeamMember={selectedTeamMember} onChange={handleLeadChange} />
                            ))}
                        </div>
                        {selectedTeamMembers?.length === 0 && <div className="text-sm text-gray-500">No Project Members Chosen Yet !</div>}
                    </div>
                </div>
            </fieldset>

            <fieldset className="rounded-xl border p-5">
                <legend className="font-bold">Client Information</legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="client_company" className="block text-sm font-medium">
                            Company<span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="client_company"
                            placeholder="Enter client company name"
                            value={data.client_company}
                            onChange={(e) => setData('client_company', e.target.value)}
                        />
                        {errors.client_company && <p className="text-sm text-red-500">{errors.client_company}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="client_name" className="block text-sm font-medium">
                            Name
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
                            Email
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
                            Phone
                        </label>
                        <Input
                            id="client_phone"
                            placeholder="Enter client phone"
                            value={data.client_phone}
                            onChange={(e) => setData('client_phone', e.target.value)}
                        />
                        {errors.client_phone && <p className="text-sm text-red-500">{errors.client_phone}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="client_origin" className="block text-sm font-medium">
                            Location
                        </label>
                        <Input
                            id="client_origin"
                            placeholder="Enter client location (city, state, country)"
                            value={data.client_origin}
                            onChange={(e) => setData('client_origin', e.target.value)}
                        />
                        {errors.client_origin && <p className="text-sm text-red-500">{errors.client_origin}</p>}
                    </div>
                </div>
            </fieldset>

            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Project Media <span className="text-red-500">*</span>
                </label>
                <MultiImageUploader
                    onImageChange={handleImageUpload}
                    onImageRemove={() => {}}
                    error={errors.images}
                    maxFiles={10}
                    helperText="SVG, PNG, JPG, GIF, MP4, WebM (max. 300 MB each)"
                    labelText="Media"
                    showLabel={false}
                />

                {displayImages.length > 0 && (
                    <div className="mt-6">
                        <h4 className="mb-3 text-sm font-medium text-gray-700">Uploaded Media ({displayImages.length})</h4>
                        <BrandingProjectImageGallery
                            images={displayImages}
                            onImageUpload={handleImageUploadForGallery}
                            onImageDelete={handleImageDelete}
                            onSetPrimaryImage={handleSetPrimaryImage}
                            onReorder={handleImageReorder}
                            isEditing={true}
                            allowDrag={true}
                        />
                    </div>
                )}
                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
            </div>

            {tags?.length > 0 && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Tags</label>
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
