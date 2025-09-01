import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import { expertiseSectionColumns } from '@/components/app/admin/expertise-sections/expertise-section-columns';
import ExpertiseSectionFilters from '@/components/app/admin/expertise-sections/expertise-section-filters';
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
import useFilter from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CommonPaginationT } from '@/types';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Expertise Sections',
        href: '/admin/expertise-sections',
    },
];

export default function ExpertiseSections({
    expertiseSections,
    filters,
}: {
    expertiseSections: CommonPaginationT<ExpertiseSectionT>;
    filters: {
        query?: string;
    };
}) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [sectionIdToDelete, setSectionIdToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: expertiseSections?.per_page,
        pageIndex: expertiseSections?.current_page,
        query: filters.query || '',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('expertise-sections.index'),
        false,
    );

    const handleFiltersChange = (newFilters: { query?: string }) => {
        setFilterStates((prev) => ({ ...prev, ...newFilters }));
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

    const handleDeleteClick = (id: number) => {
        setSectionIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (sectionIdToDelete) {
            router.delete(route('expertise-sections.destroy', sectionIdToDelete));
            setIsDeleteDialogOpen(false);
            setSectionIdToDelete(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Expertise Sections" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Expertise Sections" description="Manage your expertise sections for the home page" />
                </div>

                <ExpertiseSectionFilters filters={filters} onFiltersChange={handleFiltersChange} />

                <DataTable
                    columns={expertiseSectionColumns}
                    data={expertiseSections.data}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                    pagingData={{
                        pageIndex: expertiseSections.current_page,
                        pageSize: expertiseSections.per_page,
                        total: expertiseSections.total,
                    }}
                />
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the expertise section and remove it from our servers.
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
