import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { createArtPackageColumns } from '@/components/app/admin/art-packages/art-package-columns';
import ArtPackageFilters from '@/components/app/admin/art-packages/art-package-filters';
import DashboardTitle from '@/components/app/dashboard-title';
import { DuplicateButton } from '@/components/common/duplicate-button';
import {
    ConfirmDuplicateModal,
    CreatingDuplicateModal,
    DeletingDuplicateModal,
    SuccessDuplicateModal,
    UndoDuplicateModal,
} from '@/components/common/duplicate-modals';
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
import { useDuplicateRecord } from '@/hooks/use-duplicate-record';
import useFilter from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import { ArtPackageT, BreadcrumbItem, CommonPaginationT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Art Packages',
        href: '/admin/art-packages',
    },
];

export default function ArtPackages({
    packages,
    filters,
}: {
    packages: CommonPaginationT<ArtPackageT>;
    filters: {
        query: string;
        type: string;
    };
}) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [packageIdToDelete, setPackageIdToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: packages?.per_page,
        pageIndex: packages?.current_page,
        query: filters.query || '',
        type: filters.type || 'all',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
            type: filterStates.type,
        },
        route('art-packages.index'),
        false,
    );

    // Duplicate functionality
    const duplicateHook = useDuplicateRecord({
        duplicateRoute: route('art-packages.duplicate'),
        editRoute: (id: number) => route('art-packages.edit', id),
        onSuccess: () => {
            // Refresh the page to show the new record
            router.reload();
        },
        onError: (errors) => {
            console.error('Duplicate error:', errors);
        },
    });

    const handleSearch = (query: string) => {
        setFilterStates((prev) => ({ ...prev, query, pageIndex: 1 }));
        setIsFilter(true);
    };

    const handleSelectType = (type: string) => {
        setIsFilter(true);
        setFilterStates((prev) => ({ ...prev, type, pageIndex: 1 }));
    };

    const onPaginationChange = (page: number) => {
        setIsFilter(true);
        setFilterStates((prev) => ({
            ...prev,
            pageIndex: page,
        }));
    };

    const onSelectChange = (pageSize: number) => {
        setIsFilter(true);
        setFilterStates((prev) => ({
            ...prev,
            pageIndex: 1,
            pageSize: pageSize,
        }));
    };

    const handleDeleteClick = (id: number) => {
        setPackageIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (packageIdToDelete) {
            router.delete(route('art-packages.destroy', packageIdToDelete), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setPackageIdToDelete(null);
                },
            });
        }
    };

    const columns = createArtPackageColumns({
        handleDeleteClick,
        handleDuplicateClick: duplicateHook.handleDuplicateClick,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Art Packages" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Art Packages" description="Manage your art packages" />

                    <Link href={route('art-packages.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </Link>
                </div>

                <div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <ArtPackageFilters onSearch={handleSearch} onSelectType={handleSelectType} defaultQuery={filters.query} />
                            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                        </div>
                    </div>

                    {viewMode === 'table' ? (
                        <DataTable
                            columns={columns}
                            data={packages.data}
                            pagingData={{
                                pageIndex: packages.current_page,
                                pageSize: packages.per_page,
                                total: packages.total,
                            }}
                            onPaginationChange={onPaginationChange}
                            onSelectChange={onSelectChange}
                        />
                    ) : (
                        <>
                            <DataCardView
                                data={packages.data}
                                renderCard={(item) => (
                                    <div className="flex flex-col justify-between rounded-lg border p-4 shadow-sm">
                                        <div>
                                            <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                                            <p className="mb-2 line-clamp-2 text-sm text-gray-500">{item.description}</p>
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="text-sm font-medium">Type:</span>
                                                <span className="text-sm capitalize">{item.type}</span>
                                            </div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="text-sm font-medium">Color:</span>
                                                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            </div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="text-sm font-medium">Items:</span>
                                                <span className="text-sm">{item.items?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Price Options:</span>
                                                <span className="text-sm">{item.prices?.length || 0}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end gap-2">
                                            <Link href={route('art-packages.show', item.id)}>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={route('art-packages.edit', item.id)}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <DuplicateButton onClick={() => duplicateHook.handleDuplicateClick(item)} />
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(item.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            />
                            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
                                <div className="text-sm text-gray-500">
                                    Showing {packages.data.length} of {packages.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPaginationChange(packages.current_page - 1)}
                                        disabled={packages.current_page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPaginationChange(packages.current_page + 1)}
                                        disabled={packages.current_page === Math.ceil(packages.total / packages.per_page)}
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
                            This action cannot be undone. This will permanently delete the art package and all its associated items and prices.
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

            {/* Duplicate Modals */}
            <ConfirmDuplicateModal
                isOpen={duplicateHook.isConfirmModalOpen}
                onConfirm={duplicateHook.handleConfirmDuplicate}
                onCancel={duplicateHook.handleCancelDuplicate}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />

            <CreatingDuplicateModal
                isOpen={duplicateHook.isCreatingModalOpen}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />

            <SuccessDuplicateModal
                isOpen={duplicateHook.isSuccessModalOpen}
                onClose={duplicateHook.handleSuccessModalClose}
                onEdit={duplicateHook.handleEditDuplicatedRecord}
                onUndo={() => duplicateHook.setIsUndoModalOpen(true)}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />

            <UndoDuplicateModal
                isOpen={duplicateHook.isUndoModalOpen}
                onConfirm={duplicateHook.handleUndoDuplicate}
                onCancel={duplicateHook.handleUndoModalClose}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />

            <DeletingDuplicateModal
                isOpen={duplicateHook.isDeletingModalOpen}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />
        </AppLayout>
    );
}
