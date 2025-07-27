export interface ImageItem {
    id?: number | string;
    url?: string;
    is_primary: boolean;
    isNew?: boolean;
    file?: string | File;
}

export interface NewImage {
    file: string | File;
    url: string;
    is_primary: boolean;
}

export interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    className?: string;
    children: React.ReactNode;
    helperText?: string;
}

export interface ImageGalleryProps {
    images: ImageItem[];
    onImageClick?: (image: ImageItem) => void;
    onReorder?: (reorderedImages: ImageItem[]) => void;
    isEditing?: boolean;
    allowDrag?: boolean;
    showPrimaryBadge?: boolean;
    showDragHandle?: boolean;
    className?: string;
    imageClassName?: string;
}

export interface ImageDialogProps {
    open: boolean;
    onClose: () => void;
    image?: ImageItem;
    onDelete?: (imageId: number | string) => void;
    onSetPrimary?: (imageId: number | string) => void;
    onUpload?: (file: File | string, isPrimary: boolean) => void;
    isEditing: boolean;
    title?: string;
    uploadTitle?: string;
    manageTitle?: string;
    addTitle?: string;
    showPrimaryOption?: boolean;
    showDeleteOption?: boolean;
    aspectRatio?: string;
    placeholderText?: string;
    helperText?: string;
}
