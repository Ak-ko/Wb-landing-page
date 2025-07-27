import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Copy, Edit, Loader2, Trash2, Undo2 } from 'lucide-react';

interface ConfirmDuplicateModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    recordTitle: string;
}

export function ConfirmDuplicateModal({ isOpen, onConfirm, onCancel, recordTitle }: ConfirmDuplicateModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Copy className="h-5 w-5 text-blue-500" />
                        Duplicate Record
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to duplicate "{recordTitle}"? This will create an exact copy of this record.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} className="bg-blue-500 hover:bg-blue-600">
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface CreatingDuplicateModalProps {
    isOpen: boolean;
    recordTitle: string;
}

export function CreatingDuplicateModal({ isOpen, recordTitle }: CreatingDuplicateModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                        Creating Duplicate
                    </DialogTitle>
                    <DialogDescription>Creating a duplicate of "{recordTitle}"... Please wait.</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface SuccessDuplicateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    onUndo: () => void;
    recordTitle: string;
}

export function SuccessDuplicateModal({ isOpen, onClose, onEdit, onUndo, recordTitle }: SuccessDuplicateModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Successfully Duplicated
                    </DialogTitle>
                    <DialogDescription>
                        "{recordTitle}" has been successfully duplicated. You can now edit the new record or undo the duplication.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onUndo}>
                        <Undo2 className="mr-2 h-4 w-4" />
                        Undo
                    </Button>
                    <Button onClick={onEdit} className="bg-green-500 hover:bg-green-600">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit New Record
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface UndoDuplicateModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    recordTitle: string;
}

export function UndoDuplicateModal({ isOpen, onConfirm, onCancel, recordTitle }: UndoDuplicateModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Undo2 className="h-5 w-5 text-orange-500" />
                        Undo Duplication
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to undo the duplication? This will permanently delete the duplicated record "{recordTitle}".
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} className="bg-orange-500 hover:bg-orange-600">
                        <Undo2 className="mr-2 h-4 w-4" />
                        Undo Duplication
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface DeletingDuplicateModalProps {
    isOpen: boolean;
    recordTitle: string;
}

export function DeletingDuplicateModal({ isOpen, recordTitle }: DeletingDuplicateModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-red-500" />
                        Deleting Duplicate
                    </DialogTitle>
                    <DialogDescription>Deleting the duplicated record "{recordTitle}"... Please wait.</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
