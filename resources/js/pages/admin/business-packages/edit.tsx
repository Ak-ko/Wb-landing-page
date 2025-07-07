import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import BusinessPackageForm from '@/components/app/admin/business-package/business-package-form.tsx';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BusinessPackageT } from '@/types';

interface EditBusinessPackageProps {
    package: BusinessPackageT;
}

export default function EditBusinessPackage({ package: businessPackage }: EditBusinessPackageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Branding Packages',
            href: '/admin/business-packages',
        },
        {
            title: 'Edit',
            href: `/admin/business-packages/${businessPackage.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${businessPackage.name}`} />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title={`Edit ${businessPackage.name}`} description="Update this branding package's information" />

                    <Button variant="outline" onClick={() => router.get('/admin/business-packages')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Branding Packages
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <BusinessPackageForm businessPackage={businessPackage} onSuccess={() => router.get('/admin/business-packages')} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
