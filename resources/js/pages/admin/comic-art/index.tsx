import { Head, Link, router } from '@inertiajs/react';
import { Edit, Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { createComicArtColumns } from '@/components/app/admin/comic-art/comic-art-columns';
import ComicArtFilters from '@/components/app/admin/comic-art/comic-filters';
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
import { BreadcrumbItem, ComicArtT, CommonPaginationT, TagT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Comic',
        href: route('comic-art.index'),
    },
];

interface ComicArtIndexProps {
    comicArts: CommonPaginationT<ComicArtT>;
    filters: {
        query: string;
    };
    tags: TagT[];
}

export default function ComicArtIndex({ comicArts, filters }: ComicArtIndexProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [comicToDelete, setcomicToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: comicArts?.per_page,
        pageIndex: comicArts?.current_page,
        query: filters?.query || '',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('comic-art.index'),
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
        setcomicToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (comicToDelete) {
            router.delete(route('comic-art.destroy', comicToDelete));
            setIsDeleteDialogOpen(false);
            setcomicToDelete(null);
        }
    };

    const comicArtColumns = createComicArtColumns({
        handleDeleteClick,
    });

    const renderComicCard = (comicArt: ComicArtT) => {
        return (
            <Card
                onClick={() => {
                    router.get(route('comic-art.show', comicArt.id));
                }}
                key={comicArt.id}
                className="min-h-[200px] max-w-[300px] cursor-pointer overflow-hidden pt-0 shadow"
            >
                <div className="relative aspect-video bg-gray-100">
                    <div className="flex h-full w-full items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                    </div>
                </div>
                <CardContent className="p-4">
                    <h3 className="text-lg font-medium">{comicArt.title}</h3>
                    <p className="text-sm text-gray-500">Added on {new Date(comicArt.created_at).toLocaleDateString()}</p>
                    {comicArt.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{comicArt.description}</p>}
                </CardContent>
                <CardFooter className="flex justify-center p-4 pt-0 lg:justify-end">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={route('comic-art.edit', comicArt.id)}>
                            <Edit className="h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(comicArt.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Comic Arts" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Comic Art" description="Manage your Comic Arts" />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <ComicArtFilters onSearch={handleSearch} defaultQuery={filters?.query || ''} />

                        <div className="flex items-center justify-between gap-2">
                            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

                            <Button asChild>
                                <Link href={route('comic-art.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Comic Art
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <DataTable
                        columns={comicArtColumns}
                        data={comicArts?.data || []}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        pagingData={{
                            pageIndex: comicArts.current_page,
                            pageSize: comicArts.per_page,
                            total: comicArts.total,
                        }}
                    />
                ) : (
                    <DataCardView
                        data={comicArts?.data || []}
                        renderCard={renderComicCard}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        gridClassName="grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        pagingData={{
                            pageIndex: comicArts.current_page,
                            pageSize: comicArts.per_page,
                            total: comicArts.total,
                        }}
                    />
                )}
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the comic art and remove it from our servers.
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
