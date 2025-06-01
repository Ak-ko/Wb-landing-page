import MascortArtForm from '@/components/app/admin/mascort-art/mascort-art-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mascot Art',
        href: '/admin/mascort-art',
    },
    {
        title: 'Create',
        href: '/admin/mascort-art/create',
    },
];

export default function MascortArtCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Mascot Art" />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Create Mascot Art</h1>
                </div>

                <div className="rounded-md border p-6">
                    <MascortArtForm />
                </div>
            </div>
        </AppLayout>
    );
}
