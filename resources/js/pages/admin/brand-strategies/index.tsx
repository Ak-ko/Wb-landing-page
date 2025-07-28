import { createBrandStrategyColumns } from '@/components/app/admin/brand-strategy/brand-strategy-columns';
import BrandStrategyFilters from '@/components/app/admin/brand-strategy/brand-strategy-filters';
import DashboardTitle from '@/components/app/dashboard-title';
import {
    ConfirmDuplicateModal,
    CreatingDuplicateModal,
    DeletingDuplicateModal,
    SuccessDuplicateModal,
    UndoDuplicateModal,
} from '@/components/common/duplicate-modals';
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
import { useDuplicateRecord } from '@/hooks/use-duplicate-record';
import useFilter from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import { BrandStrategyT, BreadcrumbItem, CommonPaginationT } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Brand Strategies',
        href: '/admin/brand-strategies',
    },
];

export default function BrandStrategies({
    strategies,
    filters,
}: {
    strategies: CommonPaginationT<BrandStrategyT>;
    filters: {
        query: string;
    };
}) {
    const [strategyIdToDelete, setStrategyIdToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: strategies?.per_page,
        pageIndex: strategies?.current_page,
        query: filters.query || '',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('brand-strategies.index'),
        false,
    );

    // Duplicate functionality
    const duplicateHook = useDuplicateRecord({
        duplicateRoute: route('brand-strategies.duplicate'),
        editRoute: (id: number) => route('brand-strategies.edit', id),
        onSuccess: () => {
            // Refresh the page to show the new record
            router.reload();
        },
        onError: (errors) => {
            console.error('Duplicate error:', errors);
        },
    });

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

    const handleDeleteClick = (id: number) => setStrategyIdToDelete(id);
    const handleDeleteConfirm = () => {
        if (strategyIdToDelete) {
            router.delete(route('brand-strategies.destroy', strategyIdToDelete));
            setStrategyIdToDelete(null);
        }
    };

    const brandStrategyColumns = createBrandStrategyColumns({
        handleDeleteClick,
        handleDuplicateClick: duplicateHook.handleDuplicateClick,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brand Strategies" />
            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Brand Strategies" description="Manage your brand strategies" />
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <BrandStrategyFilters onSearch={handleSearch} defaultQuery={filters.query || ''} />
                        <Button onClick={() => router.get(route('brand-strategies.create'))}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Brand Strategy
                        </Button>
                    </div>
                </div>
                <DataTable
                    columns={brandStrategyColumns}
                    data={strategies.data}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                    pagingData={{
                        pageIndex: strategies.current_page,
                        pageSize: strategies.per_page,
                        total: strategies.total,
                    }}
                />
            </div>
            <AlertDialog open={!!strategyIdToDelete} onOpenChange={() => setStrategyIdToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Brand Strategy?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this brand strategy? This action cannot be undone.
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
