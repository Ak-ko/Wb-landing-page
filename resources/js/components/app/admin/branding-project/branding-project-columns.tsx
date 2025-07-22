import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrandingProjectT } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Image, Trash2 } from 'lucide-react';

type BrandingProjectActionsProps = {
    handleDeleteClick: (id: number) => void;
};

export const createBrandingProjectColumns = ({ handleDeleteClick }: BrandingProjectActionsProps): ColumnDef<BrandingProjectT>[] => [
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
        accessorKey: 'client_company',
        header: 'Client',
    },
    {
        accessorKey: 'client_origin',
        header: 'Location',
        cell: ({ row }) => {
            if (!row.original.client_origin) return <span>-</span>;
            return <span>{row.original.client_origin}</span>;
        },
    },
    {
        accessorKey: 'industry_type',
        header: 'Industry',
    },
    {
        accessorKey: 'year',
        header: 'Year',
        cell: ({ row }) => {
            if (!row.original.year) return <span>-</span>;
            return <span>{row.original.year}</span>;
        },
    },
    {
        accessorKey: 'project_scopes',
        header: 'Project Scope',
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
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">
                <Link href={route('branding-projects.show', row.original.id)}>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={route('branding-projects.edit', row.original.id)}>
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
