/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataCardView } from '@/components/data-view/card/data-card-view';
import { DataTable } from '@/components/data-view/table/data-table';
import { ViewMode, ViewToggle } from '@/components/data-view/view-toggle';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CommonPaginationT } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AvailableWork {
    id: number;
    label: string;
    color: string;
    text_color: string;
    is_published: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    availableWorks: CommonPaginationT<AvailableWork>;
    filters: {
        query?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Available Services',
        href: '/admin/available-works',
    },
];

export default function Index({ availableWorks, filters }: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [workIdToDelete, setWorkIdToDelete] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.query || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('available-works.index'), { query: searchQuery }, { preserveState: true });
    };

    const onPaginationChange = (page: number) => {
        router.get(route('available-works.index'), { page }, { preserveState: true });
    };

    const onSelectChange = (pageSize: number) => {
        router.get(route('available-works.index'), { perPage: pageSize }, { preserveState: true });
    };

    const handleDeleteClick = (id: number) => {
        setWorkIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (workIdToDelete) {
            router.delete(route('available-works.destroy', workIdToDelete), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setWorkIdToDelete(null);
                },
            });
        }
    };

    const togglePublished = (id: number, currentStatus: boolean) => {
        router.patch(route('available-works.update', id), {
            is_published: !currentStatus,
        });
    };

    const columns = [
        {
            accessorKey: 'label',
            header: 'Label',
        },
        {
            accessorKey: 'color',
            header: 'Colors',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: row.original.color }} />
                        <span className="font-mono text-xs">{row.original.color}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: row.original.text_color }} />
                        <span className="font-mono text-xs">{row.original.text_color}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'order',
            header: 'Order',
        },
        {
            accessorKey: 'is_published',
            header: 'Status',
            cell: ({ row }: any) => (
                <Switch checked={row.original.is_published} onCheckedChange={() => togglePublished(row.original.id, row.original.is_published)} />
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                    <Link href={route('available-works.show', row.original.id)}>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={route('available-works.edit', row.original.id)}>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(row.original.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Available Services" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Available Services</h1>
                        <p className="text-muted-foreground">Manage the available services that appear in the marquee section.</p>
                    </div>
                    <Link href={route('available-works.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </Link>
                </div>

                <div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                                    <Input
                                        placeholder="Search available services..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <Button type="submit">Search</Button>
                            </form>
                            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                        </div>
                    </div>

                    {viewMode === 'table' ? (
                        <DataTable
                            columns={columns}
                            data={availableWorks.data}
                            pagingData={{
                                pageIndex: availableWorks.current_page,
                                pageSize: availableWorks.per_page,
                                total: availableWorks.total,
                            }}
                            onPaginationChange={onPaginationChange}
                            onSelectChange={onSelectChange}
                        />
                    ) : (
                        <>
                            <DataCardView
                                data={availableWorks.data}
                                renderCard={(item) => (
                                    <div className="flex flex-col justify-between rounded-lg border p-4 shadow-sm">
                                        <div>
                                            <h3 className="mb-1 text-lg font-semibold">{item.label}</h3>
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="text-sm font-medium">Colors:</span>
                                                <div className="flex items-center gap-1">
                                                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: item.color }} />
                                                    <span className="font-mono text-xs">{item.color}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: item.text_color }} />
                                                    <span className="font-mono text-xs">{item.text_color}</span>
                                                </div>
                                            </div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="text-sm font-medium">Order:</span>
                                                <span className="text-sm">{item.order}</span>
                                            </div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="text-sm font-medium">Status:</span>
                                                <Switch
                                                    checked={item.is_published}
                                                    onCheckedChange={() => togglePublished(item.id, item.is_published)}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end gap-2">
                                            <Link href={route('available-works.show', item.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={route('available-works.edit', item.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="mr-1 h-4 w-4" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(item.id)}>
                                                <Trash2 className="mr-1 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            />
                            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
                                <div className="text-sm text-gray-500">
                                    Showing {availableWorks.data.length} of {availableWorks.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPaginationChange(availableWorks.current_page - 1)}
                                        disabled={availableWorks.current_page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPaginationChange(availableWorks.current_page + 1)}
                                        disabled={availableWorks.current_page === Math.ceil(availableWorks.total / availableWorks.per_page)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </CardFooter>
                        </>
                    )}
                </div>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the available work.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
