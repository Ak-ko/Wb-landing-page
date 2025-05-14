import { Head, Link, router } from '@inertiajs/react';
import { Edit, Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { createBlogColumns } from '@/components/app/admin/blogs/blog-columns';
import BlogFilters from '@/components/app/admin/blogs/blog-filters';
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
import { BlogT, BreadcrumbItem, CommonPaginationT, TagT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blogs',
        href: '/admin/blogs',
    },
];

interface BlogsIndexProps {
    blogs: CommonPaginationT<BlogT>;
    filters: {
        query: string;
    };
    tags: TagT[];
}

export default function BlogsIndex({ blogs, filters }: BlogsIndexProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [blogIdToDelete, setBlogIdToDelete] = useState<number | null>(null);

    // Set up filter states
    const [filterStates, setFilterStates] = useState({
        pageSize: blogs?.per_page,
        pageIndex: blogs?.current_page,
        query: filters?.query || '',
    });

    // Use the filter hook
    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('blogs.index'),
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
        setBlogIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (blogIdToDelete) {
            router.delete(route('blogs.destroy', blogIdToDelete));
            setIsDeleteDialogOpen(false);
            setBlogIdToDelete(null);
        }
    };

    const blogColumns = createBlogColumns({
        handleDeleteClick,
    });

    const renderBlogCard = (blog: BlogT) => {
        const primaryImage = blog.images.find((img) => img.is_primary) || blog.images[0];
        return (
            <Card
                onClick={() => {
                    router.get(route('blogs.show', blog.id));
                }}
                key={blog.id}
                className="min-h-[200px] max-w-[300px] cursor-pointer overflow-hidden pt-0 shadow"
            >
                <div className="relative aspect-video bg-gray-100">
                    {primaryImage ? (
                        <img src={`${primaryImage.image}`} alt={blog.title} className="h-[150px] w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Image className="h-12 w-12 text-gray-400" />
                        </div>
                    )}
                </div>
                <CardContent className="p-4">
                    <h3 className="text-lg font-medium">{blog.title}</h3>
                    <p className="text-sm text-gray-500">Added on {new Date(blog.created_at).toLocaleDateString()}</p>
                    {blog.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{blog.description}</p>}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {blog.tags.map((tag) => (
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
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={route('blogs.edit', blog.id)}>
                            <Edit className="h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(blog.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blogs" />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title="Blogs" description="Manage your blogs" />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <BlogFilters onSearch={handleSearch} defaultQuery={filters?.query || ''} />

                        <div className="flex items-center justify-between gap-2">
                            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

                            <Button asChild>
                                <Link href={route('blogs.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Blog
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <DataTable
                        columns={blogColumns}
                        data={blogs?.data || []}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        pagingData={{
                            pageIndex: blogs.current_page,
                            pageSize: blogs.per_page,
                            total: blogs.total,
                        }}
                    />
                ) : (
                    <DataCardView
                        data={blogs?.data || []}
                        renderCard={renderBlogCard}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        gridClassName="grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        pagingData={{
                            pageIndex: blogs.current_page,
                            pageSize: blogs.per_page,
                            total: blogs.total,
                        }}
                    />
                )}
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the blog and remove it from our servers.
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
