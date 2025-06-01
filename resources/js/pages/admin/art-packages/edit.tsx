import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import ArtPackageForm from '@/components/app/admin/art-packages/art-package-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { ArtPackageT, BreadcrumbItem } from '@/types';

interface EditArtPackageProps {
    package: ArtPackageT;
    types: { name: string; value: string }[];
}

export default function EditArtPackage({ package: artPackage, types }: EditArtPackageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Art Packages',
            href: '/admin/art-packages',
        },
        {
            title: 'Edit',
            href: `/admin/art-packages/${artPackage.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${artPackage.title}`} />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title={`Edit ${artPackage.title}`} description="Update this art package's information" />

                    <Button variant="outline" onClick={() => router.get('/admin/art-packages')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Art Packages
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <ArtPackageForm package={artPackage} types={types} onSuccess={() => router.get('/admin/art-packages')} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
