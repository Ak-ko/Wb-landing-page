import { Head, Link, router } from '@inertiajs/react';
import { Edit, Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { createStickerArtColumns } from '@/components/app/admin/sticker-art/sticker-art-columns';
import StickerArtFilters from '@/components/app/admin/sticker-art/sticker-art-filter';
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
import { BreadcrumbItem, CommonPaginationT, StickerArtT, TagT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sticker Art',
        href: route('sticker-art.index'),
    },
];

interface StickerArtIndexPropsT {
    stickerArts: CommonPaginationT<StickerArtT>;
    filters: {
        query: string;
    };
    tags: TagT[];
}

export default function StickerArtIndex({ stickerArts, filters }: StickerArtIndexPropsT) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [stickerToDelete, setstickerToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: stickerArts?.per_page,
        pageIndex: stickerArts?.current_page,
        query: filters?.query || '',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('sticker-art.index'),
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
        setstickerToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (stickerToDelete) {
            router.delete(route('sticker-art.destroy', stickerToDelete));
            setIsDeleteDialogOpen(false);
            setstickerToDelete(null);
        }
    };

    const stickerArtColumns = createStickerArtColumns({
        handleDeleteClick,
    });

    const renderStickerArtCard = (stickerArt: StickerArtT) => {
        return (
            <Card
                onClick={() => {
                    router.get(route('sticker-art.show', stickerArt.id));
                }}
                key={stickerArt.id}
                className="min-h-[200px] max-w-[300px] cursor-pointer overflow-hidden pt-0 shadow"
            >
                <div className="relative aspect-video bg-gray-100">
                    <div className="flex h-full w-full items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                    </div>
                </div>
                <CardContent className="p-4">
                    <h3 className="text-lg font-medium">{stickerArt.title}</h3>
                    <p className="text-sm text-gray-500">Added on {new Date(stickerArt.created_at).toLocaleDateString()}</p>
                    {stickerArt.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{stickerArt.description}</p>}
                </CardContent>
                <CardFooter className="flex justify-center p-4 pt-0 lg:justify-end">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={route('sticker-art.edit', stickerArt.id)}>
                            <Edit className="h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(stickerArt.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sticker Arts" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Sticker Art" description="Manage your Sticker Arts" />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <StickerArtFilters onSearch={handleSearch} defaultQuery={filters?.query || ''} />

                        <div className="flex items-center justify-between gap-2">
                            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

                            <Button asChild>
                                <Link href={route('sticker-art.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Sticker Art
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <DataTable
                        columns={stickerArtColumns}
                        data={stickerArts?.data || []}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        pagingData={{
                            pageIndex: stickerArts.current_page,
                            pageSize: stickerArts.per_page,
                            total: stickerArts.total,
                        }}
                    />
                ) : (
                    <DataCardView
                        data={stickerArts?.data || []}
                        renderCard={renderStickerArtCard}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        gridClassName="grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        pagingData={{
                            pageIndex: stickerArts.current_page,
                            pageSize: stickerArts.per_page,
                            total: stickerArts.total,
                        }}
                    />
                )}
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the sticker art and remove it from our servers.
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
