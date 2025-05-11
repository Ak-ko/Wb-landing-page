import { Button } from '@/components/ui/button';
import { TagT } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';

interface TagColumnActions {
    handleEdit: (tag: TagT) => void;
    handleDeleteClick: (id: number) => void;
}

export const createTagColumns = ({ handleEdit, handleDeleteClick }: TagColumnActions): ColumnDef<TagT>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="text-center">{row.getValue('id')}</div>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'color',
        header: 'Color',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full" style={{ backgroundColor: row.getValue('color') }} />
                <span>{row.getValue('color')}</span>
            </div>
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => <div>{new Date(row.getValue('created_at')).toLocaleDateString()}</div>,
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const tag = row.original;

            return (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(tag)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(tag.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
