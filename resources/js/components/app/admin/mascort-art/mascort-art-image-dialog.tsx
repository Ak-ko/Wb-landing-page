import ImageUploader from '@/components/common/image-upload';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface MascortArtImageDialogProps {
    open: boolean;
    onClose: () => void;
    image?: {
        id?: number | string;
        url?: string;
        is_primary: boolean;
        is_mascot: boolean;
        isNew?: boolean;
    };
    onDelete?: (imageId: number | string) => void;
    onSetPrimary?: (imageId: number | string) => void;
    onSetMascot?: (imageId: number | string) => void;
    onUpload?: (file: File | string, isPrimary: boolean, isMascot: boolean) => void;
    isEditing: boolean;
}

export default function MascortArtImageDialog({
    open,
    onClose,
    image,
    onDelete,
    onSetPrimary,
    onSetMascot,
    onUpload,
    isEditing,
}: MascortArtImageDialogProps) {
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | string | null>(null);
    const [isPrimary, setIsPrimary] = useState(false);
    const [isMascot, setIsMascot] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleImageChange = (file: File | string) => {
        setSelectedFile(file);
    };

    const handleUploadStateChange = (state: 'idle' | 'uploading' | 'paused' | 'error' | 'completed') => {
        setIsImageUploading(state === 'uploading' || state === 'paused');

        if (state === 'completed' && selectedFile && onUpload) {
            onUpload(selectedFile, isPrimary, isMascot);
            setSelectedFile(null);
            setIsPrimary(false);
            setIsMascot(false);
            onClose();
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setIsPrimary(false);
        setIsMascot(false);
        onClose();
    };

    const handleDeleteImage = async () => {
        if (!image?.id || !image?.url) return;

        setIsDeleting(true);
        try {
            if (typeof image.id === 'number') {
                await axios.post(`/api/image/delete/`, { path: image?.url });
            }

            if (onDelete) {
                onDelete(image.id);
            }
            onClose();
        } catch (error) {
            console.error('Error deleting image:', error);
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
                    <DialogTitle>{selectedFile ? 'Upload New Image' : image?.id ? 'Manage Image' : 'Add New Image'}</DialogTitle>
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
                                helperText="SVG, PNG, JPG or GIF (max. 300MB)"
                            />

                            {selectedFile && (
                                <div className="flex flex-col space-y-2 pt-2">
                                    <div className="flex items-center space-x-2">
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
                                            Set as primary image
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isMascot"
                                            checked={isMascot}
                                            onCheckedChange={(checked) => {
                                                setIsMascot(checked as boolean);
                                            }}
                                        />
                                        <label
                                            htmlFor="isMascot"
                                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Set as mascot image
                                        </label>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="relative">
                            <img src={image.url} alt="Mascot art image" className="max-h-64 max-w-full rounded-md object-contain" />
                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                                {image.is_primary && <span className="bg-primary rounded-full px-2 py-1 text-xs text-white">Primary</span>}
                                {image.is_mascot && <span className="bg-secondary rounded-full px-2 py-1 text-xs text-white">Mascot</span>}
                            </div>
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
                            <div className="flex space-x-2">
                                {!image.is_primary && (
                                    <Button type="button" variant="outline" onClick={() => onSetPrimary && onSetPrimary(image.id!)}>
                                        Set as Primary
                                    </Button>
                                )}
                                {!image.is_mascot && (
                                    <Button type="button" variant="outline" onClick={() => onSetMascot && onSetMascot(image.id!)}>
                                        Set as Mascot
                                    </Button>
                                )}
                            </div>
                        </>
                    ) : null}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
