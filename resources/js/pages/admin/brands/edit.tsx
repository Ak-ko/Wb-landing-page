import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import BrandForm from '@/components/app/admin/brands/brand-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BrandT, BreadcrumbItem } from '@/types';

export default function EditBrand({ brand }: { brand: BrandT }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Brands',
            href: '/brands',
        },
        {
            title: 'Edit',
            href: `/brands/${brand.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Brand: ${brand.name}`} />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title={`Edit Brand: ${brand.name}`} description="Update brand information" />

                    <Button variant="outline" onClick={() => router.get('/brands')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Brands
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <BrandForm
                            brand={brand}
                            onSuccess={() => {
                                router.visit('/brands', {
                                    only: ['brands'],
                                });
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
