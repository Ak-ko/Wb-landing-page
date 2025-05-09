import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { BusinessProcessT } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Image, Trash2 } from 'lucide-react';
import ColorTag from '../../color-tag';

// This function will be defined in the parent component (index.tsx)
// and passed to the columns when they are used
type BusinessProcessActionsProps = {
    handleEdit: (businessProcess: BusinessProcessT) => void;
    handleDeleteClick: (id: number) => void;
    handleToggleActive: (businessProcess: BusinessProcessT) => void;
};

export const createBusinessProcessColumns = ({
    handleEdit,
    handleDeleteClick,
    handleToggleActive,
}: BusinessProcessActionsProps): ColumnDef<BusinessProcessT>[] => [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => <div>{row.original.title}</div>,
    },
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.image ? (
                    <img src={row.original.image} alt={row.original.title} className="h-10 w-10 rounded object-cover" />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200">
                        <Image className="h-5 w-5 text-gray-500" />
                    </div>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'color_tag',
        header: 'Color Tag',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <ColorTag color={row?.original?.color_tag as string} />
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <span
                    className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        row.original.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    )}
                >
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'is_active',
        header: '',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Switch
                    checked={row.original.is_active}
                    onCheckedChange={() => handleToggleActive(row.original)}
                    aria-label={`Toggle ${row.original.title} active state`}
                />
            </div>
        ),
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
