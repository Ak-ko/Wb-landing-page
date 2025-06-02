import StickerImageGallery from '@/components/app/admin/sticker-art/sticker-art-image-gallery';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { StickerArtT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface StickerShowPropsT extends PageProps {
    stickerArt: StickerArtT;
}

export default function StickerArtShow({ stickerArt }: StickerShowPropsT) {
    const formattedImages = stickerArt.images.map((img) => ({
        id: img.id,
        url: `${img.image}`,
        is_primary: img.is_primary,
    }));

    return (
        <AppLayout>
            <Head title={`Sticker: ${stickerArt.title}`} />
            <div className="container px-3 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('sticker-art.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{stickerArt.title}</h1>
                    </div>
                    <Link href={route('sticker-art.edit', stickerArt.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Sticker
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <div className="rounded-md border p-6">
                            <div className="mb-6">
                                <h2 className="mb-2 text-lg font-semibold">Images</h2>
                                <StickerImageGallery images={formattedImages} onImageUpload={() => {}} isEditing={false} />
                            </div>

                            <div className="mb-6">
                                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                                <p className="text-gray-700">{stickerArt.description || 'No description provided.'}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-md border p-6">
                            <h2 className="mb-4 text-lg font-semibold">Sticker Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Created At</p>
                                    <p>{new Date(stickerArt.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Updated At</p>
                                    <p>{new Date(stickerArt.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
