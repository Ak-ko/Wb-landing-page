/* eslint-disable react-hooks/exhaustive-deps */
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface Color {
    id: number;
    color: string;
    type: 'white_bg' | 'black_bg';
}

interface ColorManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingColor: Color | null;
    selectedType: 'white_bg' | 'black_bg';
}

export default function ColorManagementModal({ isOpen, onClose, editingColor, selectedType }: ColorManagementModalProps) {
    const isEditing = !!editingColor;

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        delete: destroy,
    } = useForm({
        color: editingColor?.color || '000000',
        type: editingColor?.type || selectedType,
    });

    useEffect(() => {
        if (editingColor) {
            setData({
                color: editingColor.color,
                type: editingColor.type,
            });
        } else {
            setData({
                color: '000000',
                type: selectedType,
            });
        }
    }, [editingColor, selectedType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
        setData('color', `#${newValue}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route('theme-colors.update', editingColor.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('theme-colors.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (editingColor) {
            destroy(route('theme-colors.destroy', editingColor.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const handleClose = () => {
        onClose();
        reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Color' : 'Add New Color'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="color">Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="color"
                                    type="color"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    className="h-10 w-20 cursor-pointer border p-1"
                                />
                                <div className="relative w-full">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r px-3 text-gray-500">
                                        #
                                    </div>
                                    <Input
                                        type="text"
                                        value={data.color}
                                        onChange={handleInputChange}
                                        maxLength={6}
                                        placeholder="#000000"
                                        className="w-full pl-11"
                                    />
                                </div>
                            </div>
                            {errors.color && <p className="text-sm text-red-600">{errors.color}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Background Type</Label>
                            <Select value={data.type} onValueChange={(value: 'white_bg' | 'black_bg') => setData('type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select background type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="white_bg">For White Background</SelectItem>
                                    <SelectItem value="black_bg">For Black Background</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                        </div>

                        {/* Color Preview */}
                        <div className="grid gap-2">
                            <Label>Preview</Label>
                            <div className="flex gap-2">
                                <div
                                    className="flex h-16 w-full items-center justify-center rounded border text-white"
                                    style={{ backgroundColor: '#ffffff' }}
                                >
                                    <div className="h-8 w-8 rounded" style={{ backgroundColor: data.color }} />
                                </div>
                                <div
                                    className="flex h-16 w-full items-center justify-center rounded border text-white"
                                    style={{ backgroundColor: '#000000' }}
                                >
                                    <div className="h-8 w-8 rounded" style={{ backgroundColor: data.color }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        {isEditing && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" variant="destructive" size="sm" className="mr-auto">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Color</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this color? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} disabled={processing}>
                                            {processing ? 'Deleting...' : 'Delete'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
