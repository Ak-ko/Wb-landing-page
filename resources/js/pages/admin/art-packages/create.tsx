import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import ArtPackageForm from '@/components/app/admin/art-packages/art-package-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface CreateArtPackageProps {
    types: { name: string; value: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Art Packages',
        href: '/admin/art-packages',
    },
    {
        title: 'Create',
        href: '/admin/art-packages/create',
    },
];

export default function CreateArtPackage({ types }: CreateArtPackageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Art Package" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Create Art Package" description="Add a new art package" />

                    <Button variant="outline" onClick={() => router.get('/admin/art-packages')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Art Packages
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <ArtPackageForm types={types} onSuccess={() => router.get('/admin/art-packages')} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
