import { Head, Link, router } from '@inertiajs/react';
import { Edit, Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { createBrandingProjectColumns } from '@/components/app/admin/branding-project/branding-project-columns';
import BrandingProjectFilters from '@/components/app/admin/branding-project/branding-project-filters';
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
import useFilter from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import { BrandingProjectT, BreadcrumbItem, CommonPaginationT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Branding Projects',
        href: '/admin/branding-projects',
    },
];

export default function BrandingProjects({
    brandingProjects,
    filters,
}: {
    brandingProjects: CommonPaginationT<BrandingProjectT>;
    filters: {
        query: string;
    };
}) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [brandingProjectIdToDelete, setBrandingProjectIdToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: brandingProjects?.per_page,
        pageIndex: brandingProjects?.current_page,
        query: filters.query || '',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('branding-projects.index'),
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
        setBrandingProjectIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (brandingProjectIdToDelete) {
            router.delete(route('branding-projects.destroy', brandingProjectIdToDelete));
            setIsDeleteDialogOpen(false);
            setBrandingProjectIdToDelete(null);
        }
    };

    const brandingProjectColumns = createBrandingProjectColumns({
        handleDeleteClick,
    });

    const renderBrandingProjectCard = (brandingProject: BrandingProjectT) => (
        <Card key={brandingProject.id} className="min-h-[200px] max-w-[300px] overflow-hidden pt-0">
            <div className="relative aspect-video bg-gray-100">
                {brandingProject.images && brandingProject.images.length > 0 ? (
                    <img
                        src={`${brandingProject.images.find((img) => img.is_primary)?.image || brandingProject.images[0].image}`}
                        alt={brandingProject.title}
                        className="h-[150px] w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                    </div>
                )}
            </div>
            <CardContent className="p-4">
                <h3 className="text-lg font-medium">{brandingProject.title}</h3>
                <p className="text-sm text-gray-500">{brandingProject.client_company}</p>
                {brandingProject.industry_type && <p className="mt-2 text-sm text-gray-600">{brandingProject.industry_type}</p>}
                {brandingProject.year && <p className="mt-2 text-sm text-gray-600">{brandingProject.year}</p>}
                {brandingProject.project_scopes && <p className="mt-2 text-sm text-gray-600">{brandingProject.project_scopes}</p>}
                {brandingProject.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{brandingProject.description}</p>}
                {brandingProject.tags && brandingProject.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {brandingProject.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="inline-block rounded-full px-2 py-1 text-xs text-white"
                                style={{ backgroundColor: tag.color }}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-center p-4 pt-0 lg:justify-end">
                <Link href={route('branding-projects.edit', brandingProject.id)}>
                    <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(brandingProject.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Branding Projects" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Branding Projects" description="Manage your branding projects" />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <BrandingProjectFilters onSearch={handleSearch} defaultQuery={filters.query || ''} />

                        <div className="flex items-center justify-between gap-2">
                            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

                            <Button onClick={() => router.get(route('branding-projects.create'))}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Branding Project
                            </Button>
                        </div>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <DataTable
                        columns={brandingProjectColumns}
                        data={brandingProjects.data}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        pagingData={{
                            pageIndex: brandingProjects.current_page,
                            pageSize: brandingProjects.per_page,
                            total: brandingProjects.total,
                        }}
                    />
                ) : (
                    <DataCardView
                        data={brandingProjects.data}
                        renderCard={renderBrandingProjectCard}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        gridClassName="grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        pagingData={{
                            pageIndex: brandingProjects.current_page,
                            pageSize: brandingProjects.per_page,
                            total: brandingProjects.total,
                        }}
                    />
                )}
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the branding project and remove it from our servers.
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
