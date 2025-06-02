import IllustrationForm from '@/components/app/admin/illustration-art-images/illustration-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Illustrations',
        href: route('illustration-art.index'),
    },
    {
        title: 'Create',
        href: route('illustration-art.create'),
    },
];
export default function IllustrationCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Illustration" />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Create Illustration</h1>
                </div>

                <div className="rounded-md border p-6">
                    <IllustrationForm />
                </div>
            </div>
        </AppLayout>
    );
}
