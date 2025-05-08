import { Head, router } from '@inertiajs/react';
import { Edit, Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { createTestimonialColumns } from '@/components/app/admin/testimonials/testimonial-columns';
import TestimonialFilters from '@/components/app/admin/testimonials/testimonial-filters';
import TestimonialForm from '@/components/app/admin/testimonials/testimonial-form';
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
import { BreadcrumbItem, CommonPaginationT, TestimonialT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Testimonials',
        href: '/admin/testimonials',
    },
];

export default function Testimonials({
    testimonials,
    filters,
}: {
    testimonials: CommonPaginationT<TestimonialT>;
    filters: {
        query: string;
    };
}) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialT | null>(null);
    const [testimonialIdToDelete, setTestimonialIdToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: testimonials?.per_page,
        pageIndex: testimonials?.current_page,
        query: filters.query || '',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('testimonials.index'),
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

    const handleEdit = (testimonial: TestimonialT) => {
        setSelectedTestimonial(testimonial);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setTestimonialIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (testimonialIdToDelete) {
            router.delete(route('testimonials.destroy', testimonialIdToDelete));
            setIsDeleteDialogOpen(false);
            setTestimonialIdToDelete(null);
        }
    };

    const testimonialColumns = createTestimonialColumns({
        handleEdit,
        handleDeleteClick,
    });

    const renderTestimonialCard = (testimonial: TestimonialT) => (
        <Card key={testimonial.id} className="min-h-[200px] max-w-[300px] overflow-hidden pt-0">
            <div className="relative aspect-video bg-gray-100">
                {testimonial.image ? (
                    <img src={testimonial.image} alt={testimonial.name || 'Testimonial'} className="h-[150px] w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                    </div>
                )}
            </div>
            <CardContent className="p-4">
                <h3 className="text-lg font-medium">{testimonial.name || 'Anonymous'}</h3>
                {testimonial.position && testimonial.company && (
                    <p className="text-sm text-gray-600">
                        {testimonial.position} at {testimonial.company}
                    </p>
                )}
                <p className="text-sm text-gray-500">Added on {new Date(testimonial.created_at).toLocaleDateString()}</p>
                {testimonial.description && <p className="mt-2 text-sm text-gray-600">{testimonial.description}</p>}
            </CardContent>
            <CardFooter className="flex justify-center p-4 pt-0 lg:justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(testimonial)}>
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(testimonial.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Testimonials" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Testimonials" description="Manage your testimonials" />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <TestimonialFilters onSearch={handleSearch} defaultQuery={filters.query || ''} />

                        <div className="flex items-center justify-between gap-2">
                            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Testimonial
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Testimonial</DialogTitle>
                                    </DialogHeader>
                                    <TestimonialForm onSuccess={() => setIsAddDialogOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <DataTable
                        columns={testimonialColumns}
                        data={testimonials.data}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        pagingData={{
                            pageIndex: testimonials.current_page,
                            pageSize: testimonials.per_page,
                            total: testimonials.total,
                        }}
                    />
                ) : (
                    <DataCardView
                        data={testimonials.data}
                        renderCard={renderTestimonialCard}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        gridClassName="grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        pagingData={{
                            pageIndex: testimonials.current_page,
                            pageSize: testimonials.per_page,
                            total: testimonials.total,
                        }}
                    />
                )}
            </div>

            {isEditDialogOpen && selectedTestimonial && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Testimonial</DialogTitle>
                        </DialogHeader>
                        <TestimonialForm testimonial={selectedTestimonial} onSuccess={() => setIsEditDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the testimonial and remove it from our servers.
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
