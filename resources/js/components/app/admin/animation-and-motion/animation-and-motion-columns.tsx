import { Button } from '@/components/ui/button';
import { AnimationAndMotionT } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';

type StickerArtColumnsPropsT = {
    handleDeleteClick: (id: number) => void;
};

export const createAnimationAndMotionColumns = ({ handleDeleteClick }: StickerArtColumnsPropsT): ColumnDef<AnimationAndMotionT>[] => [
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            return <p className="line-clamp-2 text-sm text-gray-500">{row.getValue('description')}</p>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">
                <Link href={route('animation-and-motion.show', row.original.id)}>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={route('animation-and-motion.edit', row.original.id)}>
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
