import { Head, router } from '@inertiajs/react';
import { Edit, Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import BrandForm from '@/components/app/admin/brands/brand-form';
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

import { createBrandColumns } from '@/components/app/admin/brands/brand-columns';
import BrandFilters from '@/components/app/admin/brands/brand-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useFilter from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import { BrandT, BreadcrumbItem, CommonPaginationT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Brands',
        href: '/dashboard/brands',
    },
];

export default function Brands({
    brands,
    filters,
}: {
    brands: CommonPaginationT<BrandT>;
    filters: {
        query: string;
        is_active: boolean | undefined;
    };
}) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<BrandT | null>(null);
    const [brandIdToDelete, setBrandIdToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: brands?.per_page,
        pageIndex: brands?.current_page,
        query: filters.query || '',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('brands.index'),
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

    const handleEdit = (brand: BrandT) => {
        setSelectedBrand(brand);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setBrandIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (brandIdToDelete) {
            router.delete(route('brands.destroy', brandIdToDelete));
            setIsDeleteDialogOpen(false);
            setBrandIdToDelete(null);
        }
    };

    const brandColumns = createBrandColumns({
        handleEdit,
        handleDeleteClick,
    });

    const renderBrandCard = (brand: BrandT) => (
        <Card key={brand.id} className="min-h-[200px] max-w-[300px] overflow-hidden pt-0">
            <div className="relative aspect-video bg-gray-100">
                {brand.image ? (
                    <img src={brand.image} alt={brand.name} className="h-[150px] w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                    </div>
                )}
            </div>
            <CardContent className="p-4">
                <h3 className="text-lg font-medium">{brand.name}</h3>
                <p className="text-sm text-gray-500">Added on {new Date(brand.created_at).toLocaleDateString()}</p>
                {brand.description && <p className="mt-2 text-sm text-gray-600">{brand.description}</p>}
            </CardContent>
            <CardFooter className="flex justify-center p-4 pt-0 lg:justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(brand)}>
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(brand.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brands" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Brands" description="Manage your brands" />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <BrandFilters onSearch={handleSearch} defaultQuery={filters.query || ''} />

                        <div className="flex items-center justify-between gap-2">
                            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Brand
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Brand</DialogTitle>
                                    </DialogHeader>
                                    <BrandForm onSuccess={() => setIsAddDialogOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <DataTable
                        columns={brandColumns}
                        data={brands.data}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        pagingData={{
                            pageIndex: brands.current_page,
                            pageSize: brands.per_page,
                            total: brands.total,
                        }}
                    />
                ) : (
                    <DataCardView
                        data={brands.data}
                        renderCard={renderBrandCard}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        gridClassName="grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        pagingData={{
                            pageIndex: brands.current_page,
                            pageSize: brands.per_page,
                            total: brands.total,
                        }}
                    />
                )}
            </div>

            {isEditDialogOpen && selectedBrand && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Brand</DialogTitle>
                        </DialogHeader>
                        <BrandForm brand={selectedBrand} onSuccess={() => setIsEditDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the brand and remove it from our servers.
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
