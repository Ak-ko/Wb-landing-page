import { Button } from '@/components/ui/button';
import { BusinessPackageT } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Check, Edit, Eye, Trash2, X } from 'lucide-react';
import ColorTag from '../../color-tag';

type BusinessPackageActionsProps = {
    handleDeleteClick: (id: number) => void;
};

export const createBusinessPackageColumns = ({ handleDeleteClick }: BusinessPackageActionsProps): ColumnDef<BusinessPackageT>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            return <span className="line-clamp-2">{row.original.description || '-'}</span>;
        },
    },
    {
        accessorKey: 'brand_guideline',
        header: () => (
            <h1>
                Brand
                <br /> Guideline
            </h1>
        ),
        cell: ({ row }) => {
            return <span className="line-clamp-2">{row.original.brand_guideline.title || '-'}</span>;
        },
    },
    {
        header: 'Price',
        cell: ({ row }) => {
            if (!row.original.price_text) return <span>-</span>;
            return (
                <span>
                    {row.original.price_text.toLocaleString()} {row.original.currency}
                </span>
            );
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
        header: 'Recommanded ?',
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center">
                    {row.original.is_recommended ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                </div>
            );
        },
    },
    {
        accessorKey: 'items',
        header: 'Items',
        cell: ({ row }) => {
            return <span>{row.original.business_package_items?.length || 0} items</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">
                <Link href={route('business-packages.show', row.original.id)}>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={route('business-packages.edit', row.original.id)}>
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
