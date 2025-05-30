import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { createBusinessPackageAddonColumns } from '@/components/app/admin/business-package-addons/business-package-addon-columns';
import BusinessPackageAddonFilters from '@/components/app/admin/business-package-addons/business-package-addon-filters';
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
import useFilter from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BusinessPackageAddonT, CommonPaginationT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Business Package Addons',
        href: '/admin/add-on-packages',
    },
];

export default function BusinessPackageAddons({
    businessPackageAddons,
    filters,
}: {
    businessPackageAddons: CommonPaginationT<BusinessPackageAddonT>;
    filters: {
        query: string;
    };
}) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [addonIdToDelete, setAddonIdToDelete] = useState<number | null>(null);

    const [filterStates, setFilterStates] = useState({
        pageSize: businessPackageAddons?.per_page,
        pageIndex: businessPackageAddons?.current_page,
        query: filters.query || '',
    });

    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('add-on-packages.index'),
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

    const handleDeleteClick = (id: number) => {
        setAddonIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (addonIdToDelete) {
            router.delete(route('add-on-packages.destroy', addonIdToDelete));
            setIsDeleteDialogOpen(false);
            setAddonIdToDelete(null);
        }
    };

    const businessPackageAddonColumns = createBusinessPackageAddonColumns({
        handleDeleteClick,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Business Package Addons" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Business Package Addons" description="Manage your business package addons" />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <BusinessPackageAddonFilters onSearch={handleSearch} defaultQuery={filters.query || ''} />

                        <Button onClick={() => router.get(route('add-on-packages.create'))}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Addon
                        </Button>
                    </div>
                </div>

                <DataTable
                    columns={businessPackageAddonColumns}
                    data={businessPackageAddons.data}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                    pagingData={{
                        pageIndex: businessPackageAddons.current_page,
                        pageSize: businessPackageAddons.per_page,
                        total: businessPackageAddons.total,
                    }}
                />
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the addon and remove it from our servers.
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
