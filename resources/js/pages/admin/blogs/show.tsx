import BlogImageGallery from '@/components/app/admin/blogs/blog-image-gallery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BlogT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface BlogShowProps extends PageProps {
    blog: BlogT;
}

export default function BlogShow({ blog }: BlogShowProps) {
    const formattedImages = blog.images.map((img) => ({
        id: img.id,
        url: `${img.image}`,
        is_primary: img.is_primary,
    }));

    return (
        <AppLayout>
            <Head title={`Blog: ${blog.title}`} />
            <div className="container px-3 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('blogs.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{blog.title}</h1>
                    </div>
                    <Link href={route('blogs.edit', blog.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Blog
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <div className="rounded-md border p-6">
                            <div className="mb-6">
                                <h2 className="mb-2 text-lg font-semibold">Images</h2>
                                <BlogImageGallery images={formattedImages} onImageUpload={() => {}} isEditing={false} />
                            </div>

                            <div className="mb-6">
                                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                                <p className="text-gray-700">{blog.description || 'No description provided.'}</p>
                            </div>

                            <div>
                                <h2 className="mb-2 text-lg font-semibold">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags.map((tag) => (
                                        <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="text-white">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-md border p-6">
                            <h2 className="mb-4 text-lg font-semibold">Blog Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p>
                                        <Badge variant={blog.is_published ? 'default' : 'outline'} className="mt-1">
                                            {blog.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Created At</p>
                                    <p>{new Date(blog.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Updated At</p>
                                    <p>{new Date(blog.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
