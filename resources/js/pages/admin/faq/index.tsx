import { createFaqColumns } from '@/components/app/admin/faq/faq-columns';
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
import { BreadcrumbItem, CommonPaginationT, FaqT } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'FAQs', href: '/admin/faqs' }];

interface FaqsIndexProps {
    faqs: CommonPaginationT<FaqT>;
    filters: { query: string };
}

export default function FaqsIndex({ faqs }: FaqsIndexProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [faqIdToDelete, setFaqIdToDelete] = useState<number | null>(null);

    const [filterStates, setFilterStates] = useState({
        pageSize: faqs?.per_page,
        pageIndex: faqs?.current_page,
    });

    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
        },
        route('faqs.index'),
        false,
    );

    const handleDeleteClick = (id: number) => {
        setFaqIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (faqIdToDelete) {
            router.delete(route('faqs.destroy', faqIdToDelete));
            setIsDeleteDialogOpen(false);
            setFaqIdToDelete(null);
        }
    };

    const onSelectChange = (value: number) => {
        setIsFilter(true);
        return setFilterStates((prev) => ({
            ...prev,
            pageIndex: 1,
            pageSize: value,
        }));
    };

    const onPaginationChange = (page: number) => {
        setIsFilter(true);
        setFilterStates((prev) => ({
            ...prev,
            pageIndex: page,
        }));
    };

    const faqColumns = createFaqColumns({ handleDeleteClick });

    const renderFaqCard = (faq: FaqT) => (
        <Card
            onClick={() => router.get(route('faqs.show', faq.id))}
            key={faq.id}
            className="min-h-[150px] max-w-[300px] cursor-pointer overflow-hidden pt-0 shadow"
        >
            <CardContent className="p-4">
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <div className="mt-2 line-clamp-2 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </CardContent>
            <CardFooter className="flex justify-center p-4 pt-0 lg:justify-end">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={route('faqs.show', faq.id)}>
                        <Eye className="h-4 w-4" />
                        View
                    </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={route('faqs.edit', faq.id)}>
                        <Edit className="h-4 w-4" />
                        Edit
                    </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(faq.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="FAQs" />
            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="FAQs" description="Manage your FAQs" />
                    <div className="flex items-center gap-2">
                        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                        <Button asChild>
                            <Link href={route('faqs.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add FAQ
                            </Link>
                        </Button>
                    </div>
                </div>
                {viewMode === 'table' ? (
                    <DataTable
                        columns={faqColumns}
                        data={faqs?.data || []}
                        pagingData={{ pageIndex: faqs.current_page, pageSize: faqs.per_page, total: faqs.total }}
                        onSelectChange={onSelectChange}
                        onPaginationChange={onPaginationChange}
                    />
                ) : (
                    <DataCardView
                        data={faqs?.data || []}
                        renderCard={renderFaqCard}
                        gridClassName="grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        pagingData={{ pageIndex: faqs.current_page, pageSize: faqs.per_page, total: faqs.total }}
                        onSelectChange={onSelectChange}
                        onPaginationChange={onPaginationChange}
                    />
                )}
            </div>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the FAQ and remove it from our servers.
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
