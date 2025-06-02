import IllustrationImageGallery from '@/components/app/admin/illustration-art-images/illustration-image';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { IllustrationArtT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface IllustrationArtShowProps extends PageProps {
    illustrationArt: IllustrationArtT;
}

export default function IllustrationShow({ illustrationArt }: IllustrationArtShowProps) {
    const formattedImages = illustrationArt.images.map((img) => ({
        id: img.id,
        url: `${img.image}`,
        is_primary: img.is_primary,
    }));

    return (
        <AppLayout>
            <Head title={`Illustration: ${illustrationArt.title}`} />
            <div className="container px-3 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('illustration-art.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{illustrationArt.title}</h1>
                    </div>
                    <Link href={route('illustration-art.edit', illustrationArt.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Illustration
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <div className="rounded-md border p-6">
                            <div className="mb-6">
                                <h2 className="mb-2 text-lg font-semibold">Images</h2>
                                <IllustrationImageGallery images={formattedImages} onImageUpload={() => {}} isEditing={false} />
                            </div>

                            <div className="mb-6">
                                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                                <p className="text-gray-700">{illustrationArt.description || 'No description provided.'}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-md border p-6">
                            <h2 className="mb-4 text-lg font-semibold">Illustration Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Created At</p>
                                    <p>{new Date(illustrationArt.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Updated At</p>
                                    <p>{new Date(illustrationArt.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
