import BlogForm from '@/components/app/admin/blogs/blog-form';
import AppLayout from '@/layouts/app-layout';
import { TagT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, router } from '@inertiajs/react';

interface BlogCreateProps extends PageProps {
    tags: TagT[];
}

export default function BlogCreate({ tags }: BlogCreateProps) {
    const handleSuccess = () => {
        router.visit(route('blogs.index'));
    };

    return (
        <AppLayout>
            <Head title="Create Blog" />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Create Blog</h1>
                </div>

                <div className="rounded-md border p-6">
                    <BlogForm tags={tags} onSuccess={handleSuccess} />
                </div>
            </div>
        </AppLayout>
    );
}
