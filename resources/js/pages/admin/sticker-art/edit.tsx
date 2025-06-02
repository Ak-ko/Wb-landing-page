import StickerArtForm from '@/components/app/admin/sticker-art/sticker-art-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, StickerArtT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head } from '@inertiajs/react';

interface StickerEditPropsT extends PageProps {
    stickerArt: StickerArtT;
}

export default function IllustrationEdit({ stickerArt }: StickerEditPropsT) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Sticker Art',
            href: route('sticker-art.index'),
        },
        {
            title: 'Create',
            href: route('sticker-art.edit', stickerArt.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Sticker: ${stickerArt.title}`} />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Edit Sticker</h1>
                </div>

                <div className="rounded-md border p-6">
                    <StickerArtForm stickerArt={stickerArt} />
                </div>
            </div>
        </AppLayout>
    );
}
