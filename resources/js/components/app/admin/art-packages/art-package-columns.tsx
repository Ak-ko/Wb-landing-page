import { DuplicateButton } from '@/components/common/duplicate-button';
import { Button } from '@/components/ui/button';
import { ArtPackageT } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';
import ColorTag from '../../color-tag';

type ArtPackageActionsProps = {
    handleDeleteClick: (id: number) => void;
    handleDuplicateClick: (record: ArtPackageT) => void;
};

export const createArtPackageColumns = ({ handleDeleteClick, handleDuplicateClick }: ArtPackageActionsProps): ColumnDef<ArtPackageT>[] => [
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            return <span className="capitalize">{row.original.type}</span>;
        },
    },
    {
        header: 'Color',
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center">
                    <ColorTag color={row.original.color} />
                </div>
            );
        },
    },
    {
        header: 'Items',
        cell: ({ row }) => {
            return <span>{row.original.items?.length || 0} items</span>;
        },
    },
    {
        header: 'Prices',
        cell: ({ row }) => {
            return <span>{row.original.prices?.length || 0} options</span>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-end gap-1">
                    <Link href={route('art-packages.show', row.original.id)}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={route('art-packages.edit', row.original.id)}>
                        <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DuplicateButton onClick={() => handleDuplicateClick(row.original)} />
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteClick(row.original.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
