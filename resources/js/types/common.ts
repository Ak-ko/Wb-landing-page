export interface ImageItem {
    id?: number | string;
    url?: string;
    is_primary?: boolean;
    is_mascot?: boolean;
    isNew?: boolean;
    file?: string | File;
    order?: number;
    isVideo?: boolean;
}

export interface NewImage {
    file: string | File;
    url: string;
    is_primary?: boolean;
    is_mascot?: boolean;
    order?: number;
    isVideo?: boolean;
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
    showMascotBadge?: boolean;
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
    onSetMascot?: (imageId: number | string) => void;
    onUpload?: (file: File | string, isPrimary: boolean, isMascot?: boolean) => void;
    isEditing: boolean;
    title?: string;
    uploadTitle?: string;
    manageTitle?: string;
    addTitle?: string;
    showPrimaryOption?: boolean;
    showMascotOption?: boolean;
    showDeleteOption?: boolean;
    aspectRatio?: string;
    placeholderText?: string;
    helperText?: string;
    acceptedFormats?: string;
}
