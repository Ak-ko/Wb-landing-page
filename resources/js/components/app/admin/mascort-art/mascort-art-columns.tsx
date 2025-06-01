import { Button } from '@/components/ui/button';
import { MascortArtT } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Image, Trash2 } from 'lucide-react';

type MascortArtActionsProps = {
    handleDeleteClick: (id: number) => void;
};

export const createMascortArtColumns = ({ handleDeleteClick }: MascortArtActionsProps): ColumnDef<MascortArtT>[] => [
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => {
            const primaryImage = row.original.images.find((img) => img.is_primary);
            return (
                <div className="flex justify-center">
                    {primaryImage ? (
                        <img src={`${primaryImage.image}`} alt={row.original.title} className="h-10 w-10 rounded-md object-cover" />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200">
                            <Image className="h-5 w-5 text-gray-500" />
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={route('mascort-art.show', row.original.id)}>
                        <Eye className="h-4 w-4" />
                    </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={route('mascort-art.edit', row.original.id)}>
                        <Edit className="h-4 w-4" />
                    </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(row.original.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];
