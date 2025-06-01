import { createMascortArtColumns } from '@/components/app/admin/mascort-art/mascort-art-columns';
import MascortArtFilters from '@/components/app/admin/mascort-art/mascort-art-filters';
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
import { BreadcrumbItem, CommonPaginationT, MascortArtT } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mascot Art',
        href: '/admin/mascort-art',
    },
];

interface MascortArtIndexProps {
    mascortArts: CommonPaginationT<MascortArtT>;
    filters: {
        query: string;
    };
}

export default function MascortArtIndex({ mascortArts, filters }: MascortArtIndexProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [mascortArtIdToDelete, setMascortArtIdToDelete] = useState<number | null>(null);

    const [filterStates, setFilterStates] = useState({
        pageSize: mascortArts?.per_page,
        pageIndex: mascortArts?.current_page,
        query: filters?.query || '',
    });

    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('mascort-art.index'),
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
        setMascortArtIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (mascortArtIdToDelete) {
            router.delete(route('mascort-art.destroy', mascortArtIdToDelete));
            setIsDeleteDialogOpen(false);
            setMascortArtIdToDelete(null);
        }
    };

    const mascortArtColumns = createMascortArtColumns({
        handleDeleteClick,
    });

    const renderMascortArtCard = (mascortArt: MascortArtT) => {
        const primaryImage = mascortArt.images.find((img) => img.is_primary) || mascortArt.images[0];
        return (
            <Card
                onClick={() => {
                    router.get(route('mascort-art.show', mascortArt.id));
                }}
                key={mascortArt.id}
                className="min-h-[200px] max-w-[300px] cursor-pointer overflow-hidden pt-0 shadow"
            >
                <div className="relative aspect-video bg-gray-100">
                    {primaryImage ? (
                        <img src={`${primaryImage.image}`} alt={mascortArt.title} className="h-[150px] w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Image className="h-12 w-12 text-gray-400" />
                        </div>
                    )}
                </div>
                <CardContent className="p-4">
                    <h3 className="text-lg font-medium">{mascortArt.title}</h3>
                    <p className="text-sm text-gray-500">Added on {new Date(mascortArt.created_at).toLocaleDateString()}</p>
                    {mascortArt.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{mascortArt.description}</p>}
                </CardContent>
                <CardFooter className="flex justify-center p-4 pt-0 lg:justify-end">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={route('mascort-art.edit', mascortArt.id)}>
                            <Edit className="h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(mascortArt.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mascot Art" />
            <div className="container px-4 py-6">
                <DashboardTitle title="Mascot Art" />

                <div className="mb-6 flex items-center justify-between">
                    <MascortArtFilters onSearch={handleSearch} defaultQuery={filters?.query} />
                    <div className="flex items-center gap-4">
                        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                        <Button asChild>
                            <Link href={route('mascort-art.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New
                            </Link>
                        </Button>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <DataTable
                        data={mascortArts.data}
                        columns={mascortArtColumns}
                        pagingData={{
                            pageSize: filterStates.pageSize,
                            pageIndex: filterStates.pageIndex,
                            total: mascortArts.total,
                        }}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                    />
                ) : (
                    <DataCardView
                        data={mascortArts.data}
                        renderCard={renderMascortArtCard}
                        pagingData={{
                            pageSize: filterStates.pageSize,
                            pageIndex: filterStates.pageIndex,
                            total: mascortArts.total,
                        }}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                    />
                )}

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the mascot art and remove all associated data.
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
            </div>
        </AppLayout>
    );
}
