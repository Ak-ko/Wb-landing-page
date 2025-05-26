/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

import ImageUploader from '@/components/common/image-upload';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useImageColor } from '@/hooks/use-image-color'; // Assuming this hook exists
import { TeamMemberT } from '@/types'; // Assuming TeamMemberT type
import { MinusCircle, PlusCircle } from 'lucide-react'; // Assuming lucide-react is installed
import { useState } from 'react';

interface TeamMemberFormProps {
    teamMember?: TeamMemberT;
    onSuccess: () => void;
}

export default function TeamMemberForm({ teamMember, onSuccess }: TeamMemberFormProps) {
    // Safely parse social_links if it exists and is a string, otherwise initialize as empty array
    const initialSocialLinks = teamMember?.social_links && typeof teamMember.social_links === 'string' ? JSON.parse(teamMember.social_links) : [];

    // Ensure initialSocialLinks is an array of objects with platform and url
    const formattedInitialSocialLinks = Array.isArray(initialSocialLinks)
        ? initialSocialLinks.map((link: any) => ({
              platform: link.platform || '',
              url: link.url || '',
          }))
        : Object.entries(initialSocialLinks).map(([platform, url]) => ({ platform, url: url as string }));

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        name: teamMember?.name || '',
        designation: teamMember?.designation || '',
        mascot_image: teamMember?.mascot_image || '',
        email: teamMember?.email || '',
        phone: teamMember?.phone || '',
        social_links: formattedInitialSocialLinks.length > 0 ? formattedInitialSocialLinks : [{ platform: '', url: '' }], // Initialize with at least one empty link
        image: teamMember?.image || '',
        bio: teamMember?.bio || '',
        color: teamMember?.color || '#000000',
        is_active: teamMember?.is_active ?? true,
    });

    const [isMascotImageUploading, setIsMascotImageUploading] = useState(false);
    const [isUserImageUploading, setIsUserImageUploading] = useState(false);
    const [currentMascotImageUrl, setCurrentMascotImageUrl] = useState<string>(data.mascot_image || '');
    const [currentUserImageUrl, setCurrentUserImageUrl] = useState<string>(data.image || '');

    const { dominantColor, isLoading: isColorLoading } = useImageColor(currentMascotImageUrl, '#000000');

    const props = usePage<{ ziggy: { url: string } }>().props;

    useEffect(() => {
        if (!isColorLoading && dominantColor && currentMascotImageUrl) {
            setData('color', dominantColor);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dominantColor, isColorLoading, currentMascotImageUrl]);

    const handleMascotImageChange = async (file: File | string) => {
        if (typeof file === 'string') {
            setData('mascot_image', file);
            setCurrentMascotImageUrl(`${props?.ziggy?.url}/storage/${file}`);
        }
    };

    const handleUserImageChange = async (file: File | string) => {
        if (typeof file === 'string') {
            setData('image', file);
            setCurrentUserImageUrl(`${props?.ziggy?.url}/storage/${file}`);
        }
    };

    const handleMascotUploadStateChange = (state: 'idle' | 'uploading' | 'paused' | 'error' | 'completed') => {
        setIsMascotImageUploading(state === 'uploading' || state === 'paused');
    };

    const handleUserUploadStateChange = (state: 'idle' | 'uploading' | 'paused' | 'error' | 'completed') => {
        setIsUserImageUploading(state === 'uploading' || state === 'paused');
    };

    const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
        const newSocialLinks = [...data.social_links];
        newSocialLinks[index][field] = value;
        setData('social_links', newSocialLinks);
    };

    const addSocialLink = () => {
        setData('social_links', [...data.social_links, { platform: '', url: '' }]);
    };

    const removeSocialLink = (index: number) => {
        const newSocialLinks = data.social_links.filter((_, i) => i !== index);
        setData('social_links', newSocialLinks.length > 0 ? newSocialLinks : [{ platform: '', url: '' }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isMascotImageUploading || isUserImageUploading || (currentMascotImageUrl && isColorLoading)) {
            return;
        }

        const url = teamMember ? route('team-members.update', teamMember.id) : route('team-members.store');

        const socialLinksObject = data.social_links.reduce(
            (acc, link) => {
                if (link.platform && link.url) {
                    acc[link.platform] = link.url;
                }
                return acc;
            },
            {} as Record<string, string>,
        );

        transform((prevData) => ({
            ...prevData,
            social_links: JSON.stringify(socialLinksObject),
        }));

        if (teamMember) {
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

    const isProcessing = processing || isMascotImageUploading || isUserImageUploading || (currentMascotImageUrl && isColorLoading);

    return (
        <form onSubmit={handleSubmit} className="!max-h-[650px] space-y-6 !overflow-y-auto">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                    Name <span className="text-red-500">*</span>
                </label>
                <Input id="name" placeholder="Enter name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="designation" className="block text-sm font-medium">
                    Designation
                </label>
                <Input
                    id="designation"
                    placeholder="Enter designation"
                    value={data.designation}
                    onChange={(e) => setData('designation', e.target.value)}
                />
                {errors.designation && <p className="text-sm text-red-500">{errors.designation}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium">
                    Bio
                </label>
                <Textarea id="bio" placeholder="Enter Bio for this member..." value={data.bio} onChange={(e) => setData('bio', e.target.value)} />
                {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
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

            <div className="space-y-2">
                <label className="block text-sm font-medium">Social Links</label>
                {data.social_links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            placeholder="Platform (e.g., twitter)"
                            value={link.platform}
                            onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                            className="flex-1"
                        />
                        <Input
                            placeholder="URL"
                            value={link.url}
                            onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                            className="flex-1"
                        />
                        {data.social_links.length > 1 && (
                            <Button
                                type="button"
                                className="size-5 shrink-0 cursor-pointer rounded-full hover:border-red-500 hover:shadow-red-500"
                                variant="outline"
                                size="icon"
                                onClick={() => removeSocialLink(index)}
                            >
                                <MinusCircle className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Social Link
                </Button>
                {errors.social_links && <p className="text-sm text-red-500">{errors.social_links}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Mascot Image <span className="text-red-500">*</span>
                    </label>
                    <ImageUploader
                        initialImage={teamMember?.mascot_image}
                        onImageChange={handleMascotImageChange}
                        onUploadStateChange={handleMascotUploadStateChange}
                        onImageRemove={() => {
                            setData('mascot_image', '');
                            setCurrentMascotImageUrl('');
                        }}
                        placeholderText="Click to upload or drag and drop"
                        helperText="SVG, PNG, JPG or GIF (max. 300MB)"
                    />
                    {errors.mascot_image && <p className="text-sm text-red-500">{errors.mascot_image}</p>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">User Image</label>
                    <ImageUploader
                        initialImage={teamMember?.image}
                        onImageChange={handleUserImageChange}
                        onUploadStateChange={handleUserUploadStateChange}
                        onImageRemove={() => {
                            setData('image', '');
                            setCurrentUserImageUrl('');
                        }}
                        error={errors.image}
                        placeholderText="Click to upload or drag and drop"
                        helperText="SVG, PNG, JPG or GIF (max. 300MB)"
                    />
                    {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="color" className="block text-sm font-medium">
                    Color
                </label>
                <div className="flex items-center gap-3">
                    <Input
                        id="color"
                        type="color"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                        type="text"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        placeholder="#000000"
                        className="w-full"
                    />
                </div>
                <p className="text-xs text-gray-500">
                    {isColorLoading && currentMascotImageUrl
                        ? 'Extracting color from mascot image...'
                        : 'Color is automatically extracted from the mascot image, but you can change it manually'}
                </p>
                {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked as boolean)} />
                <Label htmlFor="is_active">Is Active</Label>
                {errors.is_active && <p className="text-sm text-red-500">{errors.is_active}</p>}
            </div>

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isProcessing as boolean}>
                    {processing
                        ? 'Saving...'
                        : isMascotImageUploading || isUserImageUploading
                          ? 'Uploading...'
                          : currentMascotImageUrl && isColorLoading
                            ? 'Extracting color...'
                            : teamMember
                              ? 'Update Team Member'
                              : 'Create Team Member'}
                </Button>
            </div>
        </form>
    );
}
