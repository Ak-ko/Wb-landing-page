import { DuplicateButton } from '@/components/common/duplicate-button';
import { Button } from '@/components/ui/button';
import { BusinessPackageT } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Check, Edit, Eye, Tag, Trash2, X } from 'lucide-react';
import ColorTag from '../../color-tag';

type BusinessPackageActionsProps = {
    handleDeleteClick: (id: number) => void;
    handleDuplicateClick: (record: BusinessPackageT) => void;
};

export const createBusinessPackageColumns = ({
    handleDeleteClick,
    handleDuplicateClick,
}: BusinessPackageActionsProps): ColumnDef<BusinessPackageT>[] => [
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
                <div className="space-y-1">
                    <span>
                        {row.original.price_text} {row.original.currency}
                    </span>
                    {row.original.price && <div className="text-xs text-gray-500">${row.original.price}</div>}
                    {row.original.is_discount && row.original.discount_price_text && (
                        <div className="text-xs font-medium text-red-600">{row.original.discount_price_text}</div>
                    )}
                </div>
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
        header: 'Status',
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center gap-1">
                    {row.original.is_recommended && <Check className="text-green-500" />}
                    {row.original.is_discount && <Tag className="text-red-500" />}
                    {!row.original.is_recommended && !row.original.is_discount && <X className="text-gray-400" />}
                </div>
            );
        },
    },
    {
        header: 'Durations',
        cell: ({ row }) => {
            return <span>{row.original.durations?.length || 0} duration(s)</span>;
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
                <DuplicateButton onClick={() => handleDuplicateClick(row.original)} />
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteClick(row.original.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];
