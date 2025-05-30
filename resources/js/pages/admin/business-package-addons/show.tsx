import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BusinessPackageAddonT } from '@/types';
import { ArrowLeft, CircleDollarSign, Edit, NotepadTextDashed, Package, StickyNote } from 'lucide-react';

interface ShowBusinessPackageAddonProps {
    businessPackageAddon: BusinessPackageAddonT;
}

export default function ShowBusinessPackageAddon({ businessPackageAddon }: ShowBusinessPackageAddonProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Business Package Addons',
            href: '/admin/add-on-packages',
        },
        {
            title: businessPackageAddon?.name,
            href: `/admin/add-on-packages/${businessPackageAddon.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={businessPackageAddon.name} />

            <div className="container px-3 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('add-on-packages.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{businessPackageAddon?.name}</h1>
                    </div>
                    <Link href={route('add-on-packages.edit', businessPackageAddon?.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Addon
                        </Button>
                    </Link>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <fieldset className="col-span-2 grid w-full grid-cols-1 gap-8 rounded-lg border p-5 transition-all duration-500 hover:shadow-lg lg:grid-cols-2">
                            <legend className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-500">
                                <Package className="size-3.5" /> <span>Addon Details</span>
                            </legend>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <NotepadTextDashed className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Name</span>
                                </div>
                                <p>{businessPackageAddon?.name}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <CircleDollarSign className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Price</span>
                                </div>
                                <p>
                                    {businessPackageAddon?.price_text} {businessPackageAddon?.currency}
                                </p>
                            </div>
                            {businessPackageAddon?.revision_remarks && (
                                <div className="space-y-2 lg:col-span-2">
                                    <div className="flex items-center gap-1">
                                        <StickyNote className="size-3.5" />
                                        <span className="text-sm font-semibold text-gray-500">Revision Remarks</span>
                                    </div>
                                    <p>{businessPackageAddon?.revision_remarks}</p>
                                </div>
                            )}
                        </fieldset>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
