import { router } from '@inertiajs/react';
import { useState } from 'react';

interface UseDuplicateRecordProps {
    duplicateRoute: string;
    editRoute: (id: number) => string;
    onSuccess?: (duplicatedId: number) => void;
    onError?: (error: Record<string, string>) => void;
}

interface RecordWithId {
    id: number;
    [key: string]: unknown;
}

interface FlashData {
    duplicated_id?: number;
    id?: number;
}

export const useDuplicateRecord = ({ duplicateRoute, editRoute, onSuccess, onError }: UseDuplicateRecordProps) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isUndoModalOpen, setIsUndoModalOpen] = useState(false);
    const [isDeletingModalOpen, setIsDeletingModalOpen] = useState(false);
    const [recordToDuplicate, setRecordToDuplicate] = useState<RecordWithId | null>(null);
    const [duplicatedRecordId, setDuplicatedRecordId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDuplicateClick = (record: RecordWithId) => {
        setRecordToDuplicate(record);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDuplicate = () => {
        if (!recordToDuplicate) return;

        setIsConfirmModalOpen(false);
        setIsCreatingModalOpen(true);
        setIsProcessing(true);

        router.post(
            duplicateRoute,
            { id: recordToDuplicate.id },
            {
                onSuccess: (page) => {
                    setIsCreatingModalOpen(false);
                    setIsProcessing(false);

                    // Extract the duplicated record ID from the response
                    const flashData = page.props.flash as FlashData;
                    const newId = flashData?.duplicated_id || flashData?.id;
                    if (newId) {
                        setDuplicatedRecordId(newId);
                        setIsSuccessModalOpen(true);
                        onSuccess?.(newId);
                    }
                },
                onError: (errors) => {
                    setIsCreatingModalOpen(false);
                    setIsProcessing(false);
                    onError?.(errors);
                },
            },
        );
    };

    const handleCancelDuplicate = () => {
        setIsConfirmModalOpen(false);
        setRecordToDuplicate(null);
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        setRecordToDuplicate(null);
        setDuplicatedRecordId(null);
    };

    const handleEditDuplicatedRecord = () => {
        if (duplicatedRecordId) {
            router.visit(editRoute(duplicatedRecordId));
        }
    };

    const handleUndoDuplicate = () => {
        if (!duplicatedRecordId) return;

        setIsUndoModalOpen(false);
        setIsDeletingModalOpen(true);
        setIsProcessing(true);

        router.delete(duplicateRoute, {
            data: { id: duplicatedRecordId },
            onSuccess: () => {
                setIsDeletingModalOpen(false);
                setIsProcessing(false);
                setDuplicatedRecordId(null);
                setRecordToDuplicate(null);
            },
            onError: (errors) => {
                setIsDeletingModalOpen(false);
                setIsProcessing(false);
                onError?.(errors);
            },
        });
    };

    const handleUndoModalClose = () => {
        setIsUndoModalOpen(false);
        setDuplicatedRecordId(null);
        setRecordToDuplicate(null);
    };

    return {
        // State
        isConfirmModalOpen,
        isCreatingModalOpen,
        isSuccessModalOpen,
        isUndoModalOpen,
        isDeletingModalOpen,
        isProcessing,
        recordToDuplicate,
        duplicatedRecordId,

        // Actions
        handleDuplicateClick,
        handleConfirmDuplicate,
        handleCancelDuplicate,
        handleSuccessModalClose,
        handleEditDuplicatedRecord,
        handleUndoDuplicate,
        handleUndoModalClose,
        setIsUndoModalOpen,
    };
};
