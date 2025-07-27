import { DuplicateButton } from '@/components/common/duplicate-button';
import { Button } from '@/components/ui/button';
import { BusinessBrandGuidelineT } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';

type ActionsProps = {
    handleDeleteClick: (id: number) => void;
    handleDuplicateClick: (record: BusinessBrandGuidelineT) => void;
};

export const createBusinessBrandGuidelineColumns = ({
    handleDeleteClick,
    handleDuplicateClick,
}: ActionsProps): ColumnDef<BusinessBrandGuidelineT>[] => [
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <span className="line-clamp-2">{row.original.description || '-'}</span>,
    },
    {
        accessorKey: 'elements',
        header: 'Elements',
        cell: ({ row }) => <span>{row.original.elements?.length || 0} elements</span>,
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">
                <Link href={route('business-brand-guidelines.show', row.original.id)}>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={route('business-brand-guidelines.edit', row.original.id)}>
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
