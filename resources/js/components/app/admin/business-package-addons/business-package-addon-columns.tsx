import { Button } from '@/components/ui/button';
import { BusinessPackageAddonT } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';

type BusinessPackageAddonActionsProps = {
    handleDeleteClick: (id: number) => void;
};

export const createBusinessPackageAddonColumns = ({ handleDeleteClick }: BusinessPackageAddonActionsProps): ColumnDef<BusinessPackageAddonT>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        header: 'Price',
        cell: ({ row }) => {
            if (!row.original.price_text) return <span>-</span>;
            return (
                <span>
                    {row.original.price_text} {row.original.currency}
                </span>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">
                <Link href={route('add-on-packages.show', row.original.id)}>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={route('add-on-packages.edit', row.original.id)}>
                    <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                </Link>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteClick(row.original.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];
