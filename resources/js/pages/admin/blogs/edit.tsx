import BlogForm from '@/components/app/admin/blogs/blog-form';
import AppLayout from '@/layouts/app-layout';
import { BlogT, TagT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, router } from '@inertiajs/react';

interface BlogEditProps extends PageProps {
    blog: BlogT;
    tags: TagT[];
}

export default function BlogEdit({ blog, tags }: BlogEditProps) {
    const handleSuccess = () => {
        router.visit(route('blogs.index'));
    };

    return (
        <AppLayout>
            <Head title={`Edit Blog: ${blog.title}`} />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Edit Blog</h1>
                </div>

                <div className="rounded-md border p-6">
                    <BlogForm blog={blog} tags={tags} onSuccess={handleSuccess} />
                </div>
            </div>
        </AppLayout>
    );
}
