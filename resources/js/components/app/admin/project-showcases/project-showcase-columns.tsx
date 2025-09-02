/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { Check, Edit, Eye, Trash2, X } from 'lucide-react';

interface ProjectShowcase {
    id: number;
    content: string;
    image: string;
    image_url: string;
    is_featured: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

interface UseProjectShowcaseColumnsProps {
    onDeleteClick: (id: number) => void;
}

export function useProjectShowcaseColumns({ onDeleteClick }: UseProjectShowcaseColumnsProps) {
    const toggleFeatured = (id: number, currentStatus: boolean) => {
        router.patch(route('project-showcases.update', id), {
            is_featured: !currentStatus,
        });
    };

    const columns = [
        {
            accessorKey: 'content',
            header: 'Content',
            cell: ({ row }: any) => <div className="max-w-xs truncate">{row.original.content}</div>,
        },
        {
            accessorKey: 'image',
            header: 'Image',
            cell: ({ row }: any) => (
                <div className="flex items-center">
                    <img src={row.original.image_url} alt="Showcase" className="h-12 w-12 rounded object-cover" />
                </div>
            ),
        },
        {
            accessorKey: 'order',
            header: 'Order',
        },
        {
            accessorKey: 'is_featured',
            header: 'Featured',
            cell: ({ row }: any) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => toggleFeatured(row.original.id, row.original.is_featured)}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                            row.original.is_featured ? 'text-white hover:opacity-80' : 'text-white hover:opacity-80'
                        }`}
                        style={{
                            backgroundColor: row.original.is_featured ? '#1274ef' : '#e53726',
                            borderColor: row.original.is_featured ? '#1274ef' : '#e53726',
                        }}
                        title={row.original.is_featured ? 'Featured - Click to unfeature' : 'Not Featured - Click to feature'}
                    >
                        {row.original.is_featured ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </button>
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                    <Link href={route('project-showcases.show', row.original.id)}>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={route('project-showcases.edit', row.original.id)}>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => onDeleteClick(row.original.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return { columns, toggleFeatured };
}
