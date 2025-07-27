import ImageUploader from '@/components/common/image-upload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageDialogProps } from '@/types/common';
import { Check, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default function ImageDialog({
    open,
    onClose,
    image,
    onDelete,
    onSetPrimary,
    onUpload,
    isEditing,
    title,
    uploadTitle = 'Upload New Image',
    manageTitle = 'Manage Image',
    addTitle = 'Add New Image',
    showPrimaryOption = true,
    showDeleteOption = true,
    aspectRatio = 'aspect-square',
    placeholderText = 'Drag and drop or click to upload',
    helperText = 'SVG, PNG, JPG or GIF (max. 300MB)',
}: ImageDialogProps) {
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | string | null>(null);
    const [isPrimary, setIsPrimary] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleSetPrimary = () => {
        if (image?.id && onSetPrimary) {
            onSetPrimary(image.id);
            onClose();
        }
    };

    const dialogTitle = title || (selectedFile ? uploadTitle : image?.id ? manageTitle : addTitle);

    return (
        <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    {!image?.url ? (
                        <>
                            <ImageUploader
                                initialImage={null}
                                onImageChange={handleImageChange}
                                onUploadStateChange={handleUploadStateChange}
                                onImageRemove={() => setSelectedFile(null)}
                                aspectRatio={aspectRatio}
                                placeholderText={placeholderText}
                                helperText={helperText}
                            />

                            {showPrimaryOption && (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isPrimary"
                                        checked={isPrimary}
                                        onChange={(e) => setIsPrimary(e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <label htmlFor="isPrimary" className="text-sm text-gray-700">
                                        Set as primary image
                                    </label>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="relative">
                            <img src={image.url} alt="Image" className="max-h-64 max-w-full rounded-md object-contain" />
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
                            <div className="flex space-x-2">
                                {showPrimaryOption && !image.is_primary && (
                                    <Button type="button" variant="outline" onClick={handleSetPrimary}>
                                        <Check className="mr-2 h-4 w-4" />
                                        Set as Primary
                                    </Button>
                                )}
                                {showDeleteOption && (
                                    <Button type="button" variant="destructive" onClick={handleDeleteImage} disabled={isDeleting}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </Button>
                                )}
                            </div>
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Close
                            </Button>
                        </>
                    ) : (
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
