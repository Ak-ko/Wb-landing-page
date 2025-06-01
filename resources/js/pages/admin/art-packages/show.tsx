import { Head, Link } from '@inertiajs/react';

import ColorTag from '@/components/app/color-tag';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { ArtPackageT, BreadcrumbItem } from '@/types';
import { ArrowLeft, CircleDollarSign, Edit, Package, PaintBucket } from 'lucide-react';

interface ShowArtPackageProps {
    artPackage: ArtPackageT;
}

export default function ShowArtPackage({ artPackage }: ShowArtPackageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Art Packages',
            href: '/admin/art-packages',
        },
        {
            title: artPackage?.title,
            href: `/admin/art-packages/${artPackage.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={artPackage.title} />

            <div className="container px-3 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('art-packages.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="flex flex-col gap-2 text-2xl font-bold md:flex-row md:items-center">
                            <span>{artPackage?.title}</span>
                        </h1>
                    </div>
                    <Link href={route('art-packages.edit', artPackage?.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg border p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold">Package Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Package className="mt-0.5 h-5 w-5 text-gray-500" />
                                <div>
                                    <h3 className="font-medium">Type</h3>
                                    <p className="capitalize">{artPackage.type}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <PaintBucket className="mt-0.5 h-5 w-5 text-gray-500" />
                                <div>
                                    <h3 className="font-medium">Color</h3>
                                    <div className="flex items-center gap-2">
                                        <ColorTag color={artPackage.color} />
                                        <span>{artPackage.color}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold">Package Items</h2>
                        {artPackage.items.length === 0 ? (
                            <p className="text-gray-500">No items available</p>
                        ) : (
                            <ul className="list-inside list-disc space-y-2">
                                {artPackage.items.map((item) => (
                                    <li key={item.id}>{item.item}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="rounded-lg border p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold">Price Options</h2>
                        {artPackage.prices.length === 0 ? (
                            <p className="text-gray-500">No price options available</p>
                        ) : (
                            <div className="space-y-4">
                                {artPackage.prices.map((price) => (
                                    <div key={price.id} className="flex items-start gap-3">
                                        <CircleDollarSign className="mt-0.5 h-5 w-5 text-gray-500" />
                                        <div>
                                            <h3 className="font-medium">{price.price}</h3>
                                            <p className="text-sm text-gray-500">{price.duration}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
