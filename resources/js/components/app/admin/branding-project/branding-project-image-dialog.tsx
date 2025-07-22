import ImageUploader from '@/components/common/image-upload';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { Check, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface BrandingProjectImageDialogProps {
    open: boolean;
    onClose: () => void;
    image?: {
        id?: number | string;
        url?: string;
        is_primary: boolean;
        isNew?: boolean;
    };
    onDelete?: (imageId: number | string) => void;
    onSetPrimary?: (imageId: number | string) => void;
    onUpload?: (file: File | string, isPrimary: boolean) => void;
    isEditing: boolean;
}

export default function BrandingProjectImageDialog({
    open,
    onClose,
    image,
    onDelete,
    onSetPrimary,
    onUpload,
    isEditing,
}: BrandingProjectImageDialogProps) {
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | string | null>(null);
    const [isPrimary, setIsPrimary] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Check if file is a video based on extension
    const isVideo = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
        const extension = url.toLowerCase().substring(url.lastIndexOf('.'));
        return videoExtensions.includes(extension);
    };

    const handleImageChange = (file: File | string) => {
        setSelectedFile(file);
    };

    const handleUploadStateChange = (state: 'idle' | 'uploading' | 'paused' | 'error' | 'completed') => {
        setIsImageUploading(state === 'uploading' || state === 'paused');

        if (state === 'completed' && selectedFile && onUpload) {
            onUpload(selectedFile, isPrimary);
            setSelectedFile(null);
            setIsPrimary(false);
            onClose();
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setIsPrimary(false);
        onClose();
    };

    const handleDeleteImage = async () => {
        if (!image?.id || !image?.url) return;

        setIsDeleting(true);
        try {
            // Only call the API if it's not a new image (doesn't have string ID)
            if (typeof image.id === 'number') {
                await axios.post(`/api/image/delete/`, { path: image?.url });
            }

            if (onDelete) {
                onDelete(image.id);
            }
            onClose();
        } catch (error) {
            console.error('Error deleting image:', error);
            // Still delete the database record even if file deletion fails
            if (onDelete) {
                onDelete(image.id);
            }
            onClose();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{selectedFile ? 'Upload New Media' : image?.id ? 'Manage Media' : 'Add New Media'}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    {!image?.url ? (
                        <>
                            <ImageUploader
                                initialImage={null}
                                onImageChange={handleImageChange}
                                onUploadStateChange={handleUploadStateChange}
                                onImageRemove={() => setSelectedFile(null)}
                                aspectRatio="aspect-square"
                                placeholderText="Drag and drop or click to upload"
                                helperText="SVG, PNG, JPG or MP4 Video (max. 300MB)"
                                acceptedFormats="image/jpeg, image/png, image/svg+xml, video/mp4, video/webm, video/ogg, video/avi, video/mov, video/wmv, video/flv, video/mkv"
                            />

                            {selectedFile && (
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="isPrimary"
                                        checked={isPrimary}
                                        onCheckedChange={(checked) => {
                                            setIsPrimary(checked as boolean);
                                        }}
                                    />
                                    <label
                                        htmlFor="isPrimary"
                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Set as primary media
                                    </label>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="relative">
                            {image.url && isVideo(image.url) ? (
                                <video src={image.url} controls className="max-h-64 max-w-full rounded-md object-contain" />
                            ) : (
                                <img src={image.url} alt="Project media" className="max-h-64 max-w-full rounded-md object-contain" />
                            )}
                            {image.is_primary && (
                                <div className="absolute top-2 right-2">
                                    <span className="bg-primary rounded-full px-2 py-1 text-xs text-white">Primary</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-row items-center justify-between sm:justify-between">
                    {selectedFile ? (
                        <>
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button type="button" disabled={isImageUploading} onClick={() => handleUploadStateChange('completed')}>
                                {isImageUploading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </>
                    ) : image?.id && isEditing ? (
                        <>
                            <div>
                                <Button type="button" variant="destructive" onClick={handleDeleteImage} disabled={isDeleting}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                            <div>
                                {!image.is_primary && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            onSetPrimary?.(image.id!);
                                            onClose();
                                        }}
                                        className="mr-2"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        Set as Primary
                                    </Button>
                                )}
                                <Button type="button" onClick={onClose}>
                                    Close
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Button type="button" onClick={onClose}>
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
