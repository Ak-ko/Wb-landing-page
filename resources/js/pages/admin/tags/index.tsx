import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { createTagColumns } from '@/components/app/admin/tags/tag-columns';
import TagFilters from '@/components/app/admin/tags/tag-filters';
import TagForm from '@/components/app/admin/tags/tag-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { DataTable } from '@/components/data-view/table/data-table';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useFilter from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CommonPaginationT, TagT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tags',
        href: '/admin/tags',
    },
];

export default function Tags({
    tags,
    filters,
}: {
    tags: CommonPaginationT<TagT>;
    filters: {
        query: string;
    };
}) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<TagT | null>(null);
    const [tagIdToDelete, setTagIdToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: tags?.per_page,
        pageIndex: tags?.current_page,
        query: filters.query || '',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('tags.index'),
        false,
    );

    const handleSearch = (query: string) => {
        setFilterStates((prev) => ({ ...prev, query }));
        setIsFilter(true);
    };

    const onPaginationChange = (page: number) => {
        setIsFilter(true);
        setFilterStates((prev) => ({
            ...prev,
            pageIndex: page,
        }));
    };

    const onSelectChange = (value: number) => {
        setIsFilter(true);
        return setFilterStates((prev) => ({
            ...prev,
            pageIndex: 1,
            pageSize: value,
        }));
    };

    const handleEdit = (tag: TagT) => {
        setSelectedTag(tag);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setTagIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (tagIdToDelete) {
            router.delete(route('tags.destroy', tagIdToDelete));
            setIsDeleteDialogOpen(false);
            setTagIdToDelete(null);
        }
    };

    const tagColumns = createTagColumns({
        handleEdit,
        handleDeleteClick,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tags" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Tags" description="Manage your tags" />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <TagFilters onSearch={handleSearch} defaultQuery={filters.query || ''} />

                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Tag
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Tag</DialogTitle>
                                </DialogHeader>
                                <TagForm onSuccess={() => setIsAddDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <DataTable
                    columns={tagColumns}
                    data={tags.data}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                    pagingData={{
                        pageIndex: tags.current_page,
                        pageSize: tags.per_page,
                        total: tags.total,
                    }}
                />
            </div>

            {isEditDialogOpen && selectedTag && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Tag</DialogTitle>
                        </DialogHeader>
                        <TagForm tag={selectedTag} onSuccess={() => setIsEditDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tag and remove it from our servers.
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
