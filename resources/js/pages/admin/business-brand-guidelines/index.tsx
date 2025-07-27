import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { createBusinessBrandGuidelineColumns } from '@/components/app/admin/business-brand-guideline/business-brand-guideline-columns';
import BusinessBrandGuidelineFilters from '@/components/app/admin/business-brand-guideline/business-brand-guideline-filters';
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
import { useDuplicateRecord } from '@/hooks/use-duplicate-record';
import useFilter from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import { BusinessBrandGuidelineT, CommonPaginationT } from '@/types';

interface IndexProps {
    guidelines: CommonPaginationT<BusinessBrandGuidelineT>;
    filters: { query: string };
}

export default function BusinessBrandGuidelinesIndex({ guidelines, filters }: IndexProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.query || '');

    const [filterStates, setFilterStates] = useState({
        pageSize: guidelines?.per_page,
        pageIndex: guidelines?.current_page,
        query: filters.query || '',
    });

    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('business-brand-guidelines.index'),
        false,
    );

    // Duplicate functionality
    const duplicateHook = useDuplicateRecord({
        duplicateRoute: route('business-brand-guidelines.duplicate'),
        editRoute: (id: number) => route('business-brand-guidelines.edit', id),
        onSuccess: () => {
            // Refresh the page to show the new record
            router.reload();
        },
        onError: (errors) => {
            console.error('Duplicate error:', errors);
        },
    });

    const handleDeleteClick = (id: number) => setDeleteId(id);
    const handleDeleteConfirm = () => {
        if (deleteId) {
            router.delete(`/admin/business-brand-guidelines/${deleteId}`);
            setDeleteId(null);
        }
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        setFilterStates((prev) => ({ ...prev, query }));
        setIsFilter(true);
    };
    const handlePaginationChange = (pageIndex: number) => {
        setIsFilter(true);
        setFilterStates((prev) => ({
            ...prev,
            pageIndex: pageIndex,
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

    return (
        <AppLayout>
            <Head title="Brand Guidelines" />
            <div className="space-y-4 p-4">
                <DashboardTitle title="Brand Guidelines" description="Manage your Brand Guidelines here." />

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                    <BusinessBrandGuidelineFilters onSearch={handleSearch} defaultQuery={search} />

                    <div className="flex items-center justify-between gap-2">
                        <ViewToggle viewMode={viewMode} onChange={setViewMode} />

                        <Link href="/admin/business-brand-guidelines/create">
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Create Brand Guideline
                            </Button>
                        </Link>
                    </div>
                </div>
                {viewMode === 'table' ? (
                    <DataTable
                        columns={createBusinessBrandGuidelineColumns({
                            handleDeleteClick,
                            handleDuplicateClick: duplicateHook.handleDuplicateClick,
                        })}
                        data={guidelines.data}
                        pagingData={{
                            pageIndex: guidelines?.current_page,
                            pageSize: guidelines?.per_page,
                            total: guidelines?.total,
                        }}
                        onPaginationChange={handlePaginationChange}
                        onSelectChange={onSelectChange}
                    />
                ) : (
                    <DataCardView
                        data={guidelines.data}
                        renderCard={(guideline) => (
                            <div className="rounded border p-4 shadow">
                                <div className="text-lg font-semibold">{guideline.title}</div>
                                <div className="text-muted-foreground mb-2 text-sm">{guideline.description}</div>
                                <div className="mt-2 flex gap-2">
                                    <Link href={`/admin/business-brand-guidelines/${guideline.id}`}>
                                        <Button size="icon" variant="ghost">
                                            <Eye />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/business-brand-guidelines/${guideline.id}/edit`}>
                                        <Button size="icon" variant="ghost">
                                            <Edit />
                                        </Button>
                                    </Link>
                                    <DuplicateButton onClick={() => duplicateHook.handleDuplicateClick(guideline)} />
                                    <Button size="icon" variant="destructive" onClick={() => handleDeleteClick(guideline.id)}>
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
                        )}
                        pagingData={{
                            pageIndex: guidelines?.current_page,
                            pageSize: guidelines?.per_page,
                            total: guidelines?.total,
                        }}
                        onPaginationChange={handlePaginationChange}
                        onSelectChange={onSelectChange}
                    />
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Guideline?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this business brand guideline? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
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
