import ComicArtForm from '@/components/app/admin/comic-art/comic-art-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ComicArtT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head } from '@inertiajs/react';

interface ComicArtEditPropsT extends PageProps {
    comicArt: ComicArtT;
}

export default function IllustrationEdit({ comicArt }: ComicArtEditPropsT) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Comic Art',
            href: route('comic-art.index'),
        },
        {
            title: 'Create',
            href: route('comic-art.edit', comicArt.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Comic: ${comicArt.title}`} />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Edit Comic</h1>
                </div>

                <div className="rounded-md border p-6">
                    <ComicArtForm comicArt={comicArt} />
                </div>
            </div>
        </AppLayout>
    );
}
