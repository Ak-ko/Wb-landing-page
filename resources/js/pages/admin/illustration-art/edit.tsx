import IllustrationForm from '@/components/app/admin/illustration-art-images/illustration-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IllustrationArtT, TagT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head } from '@inertiajs/react';

interface IllustrationEditProps extends PageProps {
    illustrationArt: IllustrationArtT;
    tags: TagT[];
}

export default function IllustrationEdit({ illustrationArt }: IllustrationEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Illustrations',
            href: route('illustration-art.index'),
        },
        {
            title: 'Create',
            href: route('illustration-art.edit', illustrationArt.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Illustration: ${illustrationArt.title}`} />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Edit Illustration</h1>
                </div>

                <div className="rounded-md border p-6">
                    <IllustrationForm illustrationArt={illustrationArt} />
                </div>
            </div>
        </AppLayout>
    );
}
