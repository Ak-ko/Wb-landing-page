import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogT } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, Edit, Eye, Image, Trash2, XCircle } from 'lucide-react';

type BlogActionsProps = {
    handleDeleteClick: (id: number) => void;
};

export const createBlogColumns = ({ handleDeleteClick }: BlogActionsProps): ColumnDef<BlogT>[] => [
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
        accessorKey: 'is_published',
        header: 'Status',
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.is_published ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Published
                    </Badge>
                ) : (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        <XCircle className="mr-1 h-3 w-3" />
                        Draft
                    </Badge>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-1">
                {row.original.tags.map((tag) => (
                    <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="text-white">
                        {tag.name}
                    </Badge>
                ))}
            </div>
        ),
    },
    {
        accessorKey: 'color',
        header: 'Color',
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full" style={{ backgroundColor: row.getValue('color') }} />
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => {
            return <span>{new Date(row.original.created_at).toLocaleDateString()}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">
                <Link href={route('blogs.show', row.original.id)}>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={route('blogs.edit', row.original.id)}>
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
