import ImageUploader from '@/components/common/image-upload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface ComicArtImageDialogPropsT {
    open: boolean;
    onClose: () => void;
    image?: {
        id?: number | string;
        url?: string;
        is_primary: boolean;
        isNew?: boolean;
    };
    onDelete?: (imageId: number | string) => void;
    onUpload?: (file: File | string) => void;
    isEditing: boolean;
}

export default function ComicArtImageDialog({ open, onClose, image, onDelete, onUpload, isEditing }: ComicArtImageDialogPropsT) {
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleImageChange = (file: File | string) => {
        setSelectedFile(file);
    };

    const handleUploadStateChange = (state: 'idle' | 'uploading' | 'paused' | 'error' | 'completed') => {
        setIsImageUploading(state === 'uploading' || state === 'paused');

        if (state === 'completed' && selectedFile && onUpload) {
            onUpload(selectedFile);
            setSelectedFile(null);
            onClose();
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
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
                        </>
                    ) : (
                        <div className="relative">
                            <img src={image.url} alt="Blog image" className="max-h-64 max-w-full rounded-md object-contain" />
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
