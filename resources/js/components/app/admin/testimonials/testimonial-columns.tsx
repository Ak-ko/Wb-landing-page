import { Button } from '@/components/ui/button';
import { TestimonialT } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Image, Trash2 } from 'lucide-react';
import ColorTag from '../../color-tag';

// This function will be defined in the parent component (index.tsx)
// and passed to the columns when they are used
type TestimonialActionsProps = {
    handleEdit: (testimonial: TestimonialT) => void;
    handleDeleteClick: (id: number) => void;
};

export const createTestimonialColumns = ({ handleEdit, handleDeleteClick }: TestimonialActionsProps): ColumnDef<TestimonialT>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div>{row.original.name || <span className="text-gray-400">Not provided</span>}</div>,
    },
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.image ? (
                    <img src={row.original.image} alt={row.original.name || 'Testimonial'} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        <Image className="h-5 w-5 text-gray-500" />
                    </div>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => <div>{row.original.company || <span className="text-gray-400">Not provided</span>}</div>,
    },
    {
        accessorKey: 'position',
        header: 'Position',
        cell: ({ row }) => <div>{row.original.position || <span className="text-gray-400">Not provided</span>}</div>,
    },
    {
        accessorKey: 'color_tag',
        header: 'Tag',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <ColorTag color={row?.original?.color_tag as string} />
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
