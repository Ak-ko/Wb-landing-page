import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface ExpertiseSectionT {
    id: number;
    title: string;
    type: 'business' | 'established';
    plans: { text: string; order: number }[];
    color: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const expertiseSectionColumns: ColumnDef<ExpertiseSectionT>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            const section = row.original;
            return (
                <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: section.color }} />
                    <span className="font-medium">{section.title}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue('type') as string;
            return (
                <Badge variant={type === 'business' ? 'default' : 'secondary'}>{type === 'business' ? 'New Business' : 'Established Business'}</Badge>
            );
        },
    },
    {
        accessorKey: 'plans',
        header: 'Plans Count',
        cell: ({ row }) => {
            const plans = row.getValue('plans') as { text: string; order: number }[];
            return <span className="text-sm text-gray-600">{plans.length} plans</span>;
        },
    },
    {
        accessorKey: 'order',
        header: 'Order',
        cell: ({ row }) => {
            const order = row.getValue('order') as number;
            return <span className="text-sm">{order}</span>;
        },
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue('is_active') as boolean;
            return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at') as string);
            return <span className="text-sm text-gray-600">{date.toLocaleDateString()}</span>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const section = row.original;

            const handleDelete = () => {
                if (confirm('Are you sure you want to delete this expertise section?')) {
                    router.delete(route('expertise-sections.destroy', section.id));
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={route('expertise-sections.show', section.id)} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('expertise-sections.edit', section.id)} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
