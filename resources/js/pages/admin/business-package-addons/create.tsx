import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import BusinessPackageAddonForm from '@/components/app/admin/business-package-addons/business-package-addon-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Business Package Addons',
        href: '/admin/add-on-packages',
    },
    {
        title: 'Create',
        href: '/admin/add-on-packages/create',
    },
];

export default function CreateBusinessPackageAddon() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Business Package Addon" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Create Business Package Addon" description="Add a new business package addon" />

                    <Button variant="outline" onClick={() => router.get(route('add-on-packages.index'))}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Business Package Addons
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <BusinessPackageAddonForm onSuccess={() => router.get(route('add-on-packages.index'))} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
