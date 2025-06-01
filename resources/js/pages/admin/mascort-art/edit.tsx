import MascortArtForm from '@/components/app/admin/mascort-art/mascort-art-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MascortArtT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head } from '@inertiajs/react';

interface MascortArtEditProps extends PageProps {
    mascortArt: MascortArtT;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mascot Art',
        href: '/admin/mascort-art',
    },
    {
        title: 'Edit',
        href: '/admin/mascort-art/edit',
    },
];

export default function MascortArtEdit({ mascortArt }: MascortArtEditProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Mascot Art: ${mascortArt.title}`} />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Edit Mascot Art</h1>
                </div>

                <div className="rounded-md border p-6">
                    <MascortArtForm mascortArt={mascortArt} />
                </div>
            </div>
        </AppLayout>
    );
}
