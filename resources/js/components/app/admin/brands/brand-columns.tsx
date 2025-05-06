import { Button } from '@/components/ui/button';
import { BrandT } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Image, Trash2 } from 'lucide-react';

// This function will be defined in the parent component (index.tsx)
// and passed to the columns when they are used
type BrandActionsProps = {
    handleEdit: (brand: BrandT) => void;
    handleDeleteClick: (id: number) => void;
};

export const createBrandColumns = ({ handleEdit, handleDeleteClick }: BrandActionsProps): ColumnDef<BrandT>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'image_path',
        header: 'Image',
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.image ? (
                    <img src={row.original.image} alt={row.original.name} className="h-10 w-10 rounded-md object-cover" />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200">
                        <Image className="h-5 w-5 text-gray-500" />
                    </div>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
            <div className="max-w-xs truncate">{row.original.description || <span className="text-gray-400">No description</span>}</div>
        ),
    },

    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return <span>{date.toLocaleDateString()}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteClick(row.original.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];
