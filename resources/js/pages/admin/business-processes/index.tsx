import { Head, router } from '@inertiajs/react';
import { Edit, Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { createBusinessProcessColumns } from '@/components/app/admin/business-process/business-process-columns';
import BusinessProcessFilters from '@/components/app/admin/business-process/business-process-filters';
import BusinessProcessForm from '@/components/app/admin/business-process/business-process-form';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useFilter from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BusinessProcessT, CommonPaginationT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Business Processes',
        href: '/admin/business-processes',
    },
];

export default function BusinessProcesses({
    businessProcesses,
    filters,
}: {
    businessProcesses: CommonPaginationT<BusinessProcessT>;
    filters: {
        query: string;
    };
}) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBusinessProcess, setSelectedBusinessProcess] = useState<BusinessProcessT | null>(null);
    const [businessProcessIdToDelete, setBusinessProcessIdToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: businessProcesses?.per_page,
        pageIndex: businessProcesses?.current_page,
        query: filters.query || '',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('business-processes.index'),
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

    const handleEdit = (businessProcess: BusinessProcessT) => {
        setSelectedBusinessProcess(businessProcess);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setBusinessProcessIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (businessProcessIdToDelete) {
            router.delete(route('business-processes.destroy', businessProcessIdToDelete));
            setIsDeleteDialogOpen(false);
            setBusinessProcessIdToDelete(null);
        }
    };

    const handleToggleActive = (businessProcess: BusinessProcessT) => {
        router.put(route('business-processes.update', businessProcess.id), {
            ...businessProcess,
            is_active: !businessProcess.is_active,
        });
    };

    const businessProcessColumns = createBusinessProcessColumns({
        handleEdit,
        handleDeleteClick,
        handleToggleActive,
    });

    const renderBusinessProcessCard = (businessProcess: BusinessProcessT) => (
        <Card key={businessProcess.id} className="min-h-[200px] max-w-[300px] overflow-hidden pt-0">
            <div className="relative aspect-video bg-gray-100">
                {businessProcess.image ? (
                    <img src={businessProcess.image} alt={businessProcess.title} className="h-[150px] w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                    </div>
                )}
                <div className="absolute bottom-0 left-0 h-2 w-full" style={{ backgroundColor: businessProcess.color_tag }}></div>
            </div>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{businessProcess.title}</h3>
                    {!businessProcess.is_active && <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">Inactive</span>}
                </div>
                <p className="text-sm text-gray-500">Added on {new Date(businessProcess.created_at).toLocaleDateString()}</p>
                {businessProcess.description && <p className="mt-2 text-sm text-gray-600">{businessProcess.description}</p>}
            </CardContent>
            <CardFooter className="flex justify-center p-4 pt-0 lg:justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(businessProcess)}>
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(businessProcess.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Business Processes" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Business Processes" description="Manage your business processes" />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <BusinessProcessFilters onSearch={handleSearch} defaultQuery={filters.query || ''} />

                        <div className="flex items-center justify-between gap-2">
                            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Business Process
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Business Process</DialogTitle>
                                    </DialogHeader>
                                    <BusinessProcessForm onSuccess={() => setIsAddDialogOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {viewMode === 'table' && (
                        <DataTable
                            columns={businessProcessColumns}
                            data={businessProcesses?.data || []}
                            onPaginationChange={onPaginationChange}
                            onSelectChange={onSelectChange}
                            pagingData={{
                                total: businessProcesses?.total || 0,
                                pageSize: filterStates.pageSize,
                                pageIndex: filterStates.pageIndex,
                            }}
                        />
                    )}
                    {viewMode === 'card' && (
                        <DataCardView
                            data={businessProcesses?.data || []}
                            renderCard={renderBusinessProcessCard}
                            onPaginationChange={onPaginationChange}
                            onSelectChange={onSelectChange}
                            pagingData={{
                                pageIndex: businessProcesses.current_page,
                                pageSize: businessProcesses.per_page,
                                total: businessProcesses.total,
                            }}
                        />
                    )}
                </div>
            </div>
            {isEditDialogOpen && selectedBusinessProcess && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Business Process</DialogTitle>
                        </DialogHeader>
                        <BusinessProcessForm businessProcess={selectedBusinessProcess} onSuccess={() => setIsEditDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the business process and remove it from our servers.
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
