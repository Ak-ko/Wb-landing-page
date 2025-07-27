import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

import ImageGallery from '@/components/common/image-gallery';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MascortArtT } from '@/types';
import { PageProps } from '@inertiajs/core';

interface MascortArtShowProps extends PageProps {
    mascortArt: MascortArtT;
}

export default function MascortArtShow({ mascortArt }: MascortArtShowProps) {
    const formattedImages = mascortArt.images.map((img) => ({
        id: img.id,
        url: `${img.image}`,
        is_primary: img.is_primary,
        is_mascot: img.is_mascot,
    }));

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Mascot Art',
            href: '/admin/mascort-art',
        },
        {
            title: mascortArt?.title,
            href: `/admin/mascort-art/${mascortArt.id}/show`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Mascot Art: ${mascortArt.title}`} />
            <div className="container px-4 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" asChild>
                            <Link href={route('mascort-art.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Mascot Art
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">{mascortArt.title}</h1>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('mascort-art.edit', mascortArt.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                <div className="space-y-6 rounded-lg border p-6">
                    {mascortArt.description && (
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">Description</h2>
                            <p className="text-gray-600">{mascortArt.description}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Images</h2>
                        <ImageGallery images={formattedImages} isEditing={false} showMascotBadge={true} />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Additional Information</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Created At</p>
                                <p>{new Date(mascortArt.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                <p>{new Date(mascortArt.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
