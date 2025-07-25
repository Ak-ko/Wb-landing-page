import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import BusinessPackageForm from '@/components/app/admin/business-package/business-package-form.tsx';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Branding Packages',
        href: '/admin/business-packages',
    },
    {
        title: 'Create',
        href: '/admin/business-packages/create',
    },
];

export default function CreateBusinessPackage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Branding Package" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Create Branding Package" description="Add a new branding package" />

                    <Button variant="outline" onClick={() => router.get('/admin/business-packages')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Branding Packages
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <BusinessPackageForm onSuccess={() => router.get('/admin/business-packages')} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
