import StickerArtForm from '@/components/app/admin/sticker-art/sticker-art-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sticker Arts',
        href: route('sticker-art.index'),
    },
    {
        title: 'Create',
        href: route('sticker-art.create'),
    },
];
export default function StickerCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Sticker Art" />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Create Sticker</h1>
                </div>
                <div className="rounded-md border p-6">
                    <StickerArtForm />
                </div>
            </div>
        </AppLayout>
    );
}
