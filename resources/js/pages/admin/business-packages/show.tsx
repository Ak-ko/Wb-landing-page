import { Head, Link } from '@inertiajs/react';

import ColorTag from '@/components/app/color-tag';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BusinessPackageT } from '@/types';
import { ArrowLeft, Calendar, Check, CircleDollarSign, Edit, NotepadTextDashed, Package, PaintBucket, SquareStack, StickyNote } from 'lucide-react';

interface ShowBusinessPackageProps {
    businessPackage: BusinessPackageT;
}

export default function ShowBusinessPackage({ businessPackage }: ShowBusinessPackageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Business Packages',
            href: '/admin/business-packages',
        },
        {
            title: businessPackage?.name,
            href: `/admin/business-packages/${businessPackage.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={businessPackage.name} />

            <div className="container px-3 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('business-packages.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="flex flex-col gap-2 text-2xl font-bold md:flex-row md:items-center">
                            <span>{businessPackage?.name}</span>
                            {!!businessPackage?.is_recommended && <Badge>Recommanded</Badge>}
                        </h1>
                    </div>
                    <Link href={route('business-packages.edit', businessPackage?.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Blog
                        </Button>
                    </Link>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <fieldset className="col-span-2 grid w-full grid-cols-1 gap-8 rounded-lg border p-5 transition-all duration-500 hover:shadow-lg lg:grid-cols-2">
                            <legend className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-500">
                                <Package className="size-3.5" /> <span>Package Details</span>
                            </legend>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <NotepadTextDashed className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Description</span>
                                </div>
                                <p>{businessPackage?.description}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <CircleDollarSign className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Price</span>
                                </div>
                                <p>
                                    {businessPackage?.price_text} {businessPackage?.currency}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Duration</span>
                                </div>
                                <p>{businessPackage?.duration}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <PaintBucket className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Color</span>
                                </div>
                                <ColorTag color={businessPackage?.color} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <StickyNote className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Revision Remarks</span>
                                </div>
                                <p>{businessPackage?.revision_remarks}</p>
                            </div>
                        </fieldset>
                        <fieldset className="col-span-2 space-y-2 rounded-lg border p-5">
                            <legend className="flex items-center gap-1">
                                <SquareStack className="size-3.5" />
                                <span className="text-sm font-semibold text-gray-500">Package Included Items</span>
                            </legend>
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                {businessPackage?.business_package_items?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="mb-2 flex items-center gap-2 rounded-xl border p-2 shadow transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <Check className="size-4 stroke-3" />
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
