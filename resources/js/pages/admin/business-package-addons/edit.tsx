import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import BusinessPackageAddonForm from '@/components/app/admin/business-package-addons/business-package-addon-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BusinessPackageAddonT } from '@/types';

interface EditBusinessPackageAddonProps {
    businessPackageAddon: BusinessPackageAddonT;
}

export default function EditBusinessPackageAddon({ businessPackageAddon }: EditBusinessPackageAddonProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Business Package Addons',
            href: '/admin/add-on-packages',
        },
        {
            title: 'Edit',
            href: `/admin/add-on-packages/${businessPackageAddon.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${businessPackageAddon.name}`} />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title={`Edit ${businessPackageAddon.name}`} description="Update this business package addon's information" />

                    <Button variant="outline" onClick={() => router.get(route('add-on-packages.index'))}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Business Package Addons
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <BusinessPackageAddonForm
                            businessPackageAddon={businessPackageAddon}
                            onSuccess={() => router.get(route('add-on-packages.index'))}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
