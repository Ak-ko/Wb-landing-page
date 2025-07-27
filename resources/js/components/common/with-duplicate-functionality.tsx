import {
    ConfirmDuplicateModal,
    CreatingDuplicateModal,
    DeletingDuplicateModal,
    SuccessDuplicateModal,
    UndoDuplicateModal,
} from '@/components/common/duplicate-modals';
import { useDuplicateRecord } from '@/hooks/use-duplicate-record';
import React from 'react';

interface WithDuplicateFunctionalityProps {
    duplicateRoute: string;
    editRoute: (id: number) => string;
    onSuccess?: (duplicatedId: number) => void;
    onError?: (error: Record<string, string>) => void;
    children: (duplicateHook: ReturnType<typeof useDuplicateRecord>) => React.ReactNode;
}

export function WithDuplicateFunctionality({ duplicateRoute, editRoute, onSuccess, onError, children }: WithDuplicateFunctionalityProps) {
    const duplicateHook = useDuplicateRecord({
        duplicateRoute,
        editRoute,
        onSuccess,
        onError,
    });

    return (
        <>
            {children(duplicateHook)}

            {/* Duplicate Modals */}
            <ConfirmDuplicateModal
                isOpen={duplicateHook.isConfirmModalOpen}
                onConfirm={duplicateHook.handleConfirmDuplicate}
                onCancel={duplicateHook.handleCancelDuplicate}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />

            <CreatingDuplicateModal
                isOpen={duplicateHook.isCreatingModalOpen}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />

            <SuccessDuplicateModal
                isOpen={duplicateHook.isSuccessModalOpen}
                onClose={duplicateHook.handleSuccessModalClose}
                onEdit={duplicateHook.handleEditDuplicatedRecord}
                onUndo={() => duplicateHook.setIsUndoModalOpen(true)}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />

            <UndoDuplicateModal
                isOpen={duplicateHook.isUndoModalOpen}
                onConfirm={duplicateHook.handleUndoDuplicate}
                onCancel={duplicateHook.handleUndoModalClose}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />

            <DeletingDuplicateModal
                isOpen={duplicateHook.isDeletingModalOpen}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />
        </>
    );
}
