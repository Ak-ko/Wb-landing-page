import { Button } from '@/components/ui/button';
import { FaqT } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, Edit, Eye, Trash2, XCircle } from 'lucide-react';
import ColorTag from '../../color-tag';

type FaqActionsProps = {
    handleDeleteClick: (id: number) => void;
};

export const createFaqColumns = ({ handleDeleteClick }: FaqActionsProps): ColumnDef<FaqT>[] => [
    {
        accessorKey: 'question',
        header: 'Question',
    },
    {
        accessorKey: 'color',
        header: 'Color',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <ColorTag color={row.original.color} />
            </div>
        ),
    },
    {
        accessorKey: 'is_published',
        header: 'Status',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                {row.original.is_published ? (
                    <div className="flex items-center text-green-600">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        <span>Published</span>
                    </div>
                ) : (
                    <div className="flex items-center text-gray-500">
                        <XCircle className="mr-1 h-4 w-4" />
                        <span>Draft</span>
                    </div>
                )}
            </div>
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const faq = row.original;
            return (
                <div className="flex items-center justify-center">
                    <Link href={route('faqs.show', faq.id)}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={route('faqs.edit', faq.id)}>
                        <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDeleteClick(faq.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
