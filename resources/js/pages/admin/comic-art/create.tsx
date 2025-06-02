import ComicArtForm from '@/components/app/admin/comic-art/comic-art-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Comic Arts',
        href: route('comic-art.index'),
    },
    {
        title: 'Create',
        href: route('comic-art.create'),
    },
];
export default function ComicCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Comic" />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Create Comic</h1>
                </div>

                <div className="rounded-md border p-6">
                    <ComicArtForm />
                </div>
            </div>
        </AppLayout>
    );
}
