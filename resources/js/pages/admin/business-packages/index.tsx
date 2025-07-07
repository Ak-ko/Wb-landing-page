import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { createBusinessPackageColumns } from '@/components/app/admin/business-package/business-package-columns';
import BusinessPackageFilters from '@/components/app/admin/business-package/business-package-filters.tsx';
import DashboardTitle from '@/components/app/dashboard-title';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import useFilter from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BusinessPackageT, CommonPaginationT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Branding Packages',
        href: '/admin/business-packages',
    },
];

export default function BusinessPackages({
    packages,
    filters,
}: {
    packages: CommonPaginationT<BusinessPackageT>;
    filters: {
        query: string;
        guideline_id: number | null;
        brand_strategy_id?: number | null;
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
        guideline_id: filters?.guideline_id || null,
        brand_strategy_id: filters?.brand_strategy_id || null,
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
            guideline_id: filterStates.guideline_id,
            brand_strategy_id: filterStates.brand_strategy_id,
        },
        route('business-packages.index'),
        false,
    );

    const handleSearch = (query: string) => {
        setFilterStates((prev) => ({ ...prev, query, pageIndex: 1 }));
        setIsFilter(true);
    };

    const handleFilter = (guideline: number) => {
        setFilterStates((prev) => ({ ...prev, guideline_id: guideline, pageIndex: 1 }));
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
        setPackageIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (packageIdToDelete) {
            router.delete(route('business-packages.destroy', packageIdToDelete));
            setIsDeleteDialogOpen(false);
            setPackageIdToDelete(null);
        }
    };

    const businessPackageColumns = createBusinessPackageColumns({
        handleDeleteClick,
    });

    const renderBusinessPackageCard = (businessPackage: BusinessPackageT) => (
        <Card
            onClick={() => {
                router.get(route('business-packages.show', businessPackage.id));
            }}
            key={businessPackage.id}
            className="relative min-h-[200px] max-w-[300px] cursor-pointer overflow-hidden pt-0"
        >
            {businessPackage?.is_recommended && <Badge className="absolute top-2 right-2 text-xs">Recommended</Badge>}
            {businessPackage?.is_discount && (
                <Badge className="absolute top-2 left-2 text-xs" variant="destructive">
                    Discount
                </Badge>
            )}

            <CardContent className="p-4">
                <h3 className="text-lg font-medium">{businessPackage.name}</h3>
                {businessPackage.price_text && businessPackage.currency && (
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                            {businessPackage.price_text} {businessPackage.currency}
                        </p>
                        {businessPackage.price && <p className="text-xs text-gray-400">${businessPackage.price}</p>}
                        {businessPackage.is_discount && businessPackage.discount_price_text && (
                            <p className="text-xs font-medium text-red-600">{businessPackage.discount_price_text}</p>
                        )}
                    </div>
                )}
                {businessPackage.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{businessPackage.description}</p>}
            </CardContent>
            <CardFooter className="flex justify-center p-4 pt-0 lg:justify-end">
                <Link href={route('business-packages.edit', businessPackage.id)}>
                    <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(businessPackage.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Branding Packages" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Branding Packages" description="Manage your branding packages" />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <BusinessPackageFilters
                            onSearch={handleSearch}
                            onFilter={handleFilter}
                            defaultGuideline={filters?.guideline_id || null}
                            defaultQuery={filters.query || ''}
                        />

                        <div className="flex items-center justify-between gap-2">
                            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

                            <Button onClick={() => router.get(route('business-packages.create'))}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Branding Package
                            </Button>
                        </div>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <DataTable
                        columns={businessPackageColumns}
                        data={packages.data}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        pagingData={{
                            pageIndex: packages.current_page,
                            pageSize: packages.per_page,
                            total: packages.total,
                        }}
                    />
                ) : (
                    <DataCardView
                        data={packages.data}
                        renderCard={renderBusinessPackageCard}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        gridClassName="grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        pagingData={{
                            pageIndex: packages.current_page,
                            pageSize: packages.per_page,
                            total: packages.total,
                        }}
                    />
                )}
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the branding package and remove it from our servers.
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
