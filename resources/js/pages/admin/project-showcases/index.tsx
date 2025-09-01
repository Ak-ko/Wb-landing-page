/* eslint-disable @typescript-eslint/no-explicit-any */
import { useProjectShowcaseColumns } from '@/components/app/admin/project-showcases/project-showcase-columns';
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
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CommonPaginationT } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Edit, Eye, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';

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

interface Props {
    projectShowcases: CommonPaginationT<ProjectShowcase>;
    filters?: {
        query?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Showcases',
        href: '/admin/project-showcases',
    },
];

export default function Index({ projectShowcases, filters }: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [showcaseIdToDelete, setShowcaseIdToDelete] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.query || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('project-showcases.index'), { query: searchQuery }, { preserveState: true });
    };

    const onPaginationChange = (page: number) => {
        router.get(route('project-showcases.index'), { page }, { preserveState: true });
    };

    const onSelectChange = (pageSize: number) => {
        router.get(route('project-showcases.index'), { perPage: pageSize }, { preserveState: true });
    };

    const handleDeleteClick = (id: number) => {
        setShowcaseIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (showcaseIdToDelete) {
            router.delete(route('project-showcases.destroy', showcaseIdToDelete), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setShowcaseIdToDelete(null);
                },
            });
        }
    };

    const { columns } = useProjectShowcaseColumns({ onDeleteClick: handleDeleteClick });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Project Showcases" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Project Showcases</h1>
                        <p className="text-muted-foreground">Manage the project showcases that appear on the homepage.</p>
                    </div>
                    <Link href={route('project-showcases.create')}>
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
                                        placeholder="Search project showcases..."
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
                            data={projectShowcases.data}
                            pagingData={{
                                pageIndex: projectShowcases.current_page,
                                pageSize: projectShowcases.per_page,
                                total: projectShowcases.total,
                            }}
                            onPaginationChange={onPaginationChange}
                            onSelectChange={onSelectChange}
                        />
                    ) : (
                        <>
                            <DataCardView
                                data={projectShowcases.data}
                                renderCard={(item) => (
                                    <div className="flex flex-col justify-between rounded-lg border p-4 shadow-sm">
                                        <div>
                                            <div className="mb-3">
                                                <img src={item.image_url} alt="Showcase" className="h-24 w-full rounded object-cover" />
                                            </div>
                                            <p className="mb-2 text-sm text-gray-600">{item.content}</p>
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="text-sm font-medium">Order:</span>
                                                <span className="text-sm">{item.order}</span>
                                            </div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="text-sm font-medium">Featured:</span>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="flex h-5 w-5 items-center justify-center rounded-full border-2 text-white"
                                                        style={{
                                                            backgroundColor: item.is_featured ? '#1274ef' : '#e53726',
                                                            borderColor: item.is_featured ? '#1274ef' : '#e53726',
                                                        }}
                                                    >
                                                        {item.is_featured ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                                                    </div>
                                                    <span className="text-xs">{item.is_featured ? 'Yes' : 'No'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end gap-2">
                                            <Link href={route('project-showcases.show', item.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={route('project-showcases.edit', item.id)}>
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
                                    Showing {projectShowcases.data.length} of {projectShowcases.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPaginationChange(projectShowcases.current_page - 1)}
                                        disabled={projectShowcases.current_page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPaginationChange(projectShowcases.current_page + 1)}
                                        disabled={projectShowcases.current_page === Math.ceil(projectShowcases.total / projectShowcases.per_page)}
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
                            This action cannot be undone. This will permanently delete the project showcase.
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
