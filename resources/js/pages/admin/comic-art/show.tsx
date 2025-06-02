import ComicImageGallery from '@/components/app/admin/comic-art/comic-art-image-gallery';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { ComicArtT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface ComicArtShowPropsT extends PageProps {
    comicArt: ComicArtT;
}

export default function ComicArtShow({ comicArt }: ComicArtShowPropsT) {
    const formattedImages = comicArt.images.map((img) => ({
        id: img.id,
        url: `${img.image}`,
        is_primary: img.is_primary,
    }));

    return (
        <AppLayout>
            <Head title={`Comic: ${comicArt.title}`} />
            <div className="container px-3 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('comic-art.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{comicArt.title}</h1>
                    </div>
                    <Link href={route('comic-art.edit', comicArt.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Comic
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <div className="rounded-md border p-6">
                            <div className="mb-6">
                                <h2 className="mb-2 text-lg font-semibold">Images</h2>
                                <ComicImageGallery images={formattedImages} onImageUpload={() => {}} isEditing={false} />
                            </div>

                            <div className="mb-6">
                                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                                <p className="text-gray-700">{comicArt.description || 'No description provided.'}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-md border p-6">
                            <h2 className="mb-4 text-lg font-semibold">Comic Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Created At</p>
                                    <p>{new Date(comicArt.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Updated At</p>
                                    <p>{new Date(comicArt.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
