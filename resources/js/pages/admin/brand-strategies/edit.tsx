import BrandStrategyForm from '@/components/app/admin/brand-strategy/brand-strategy-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BrandStrategyT, BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface EditBrandStrategyProps {
    strategy: BrandStrategyT;
}

export default function EditBrandStrategy({ strategy }: EditBrandStrategyProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Brand Strategies',
            href: '/admin/brand-strategies',
        },
        {
            title: 'Edit',
            href: `/admin/brand-strategies/${strategy.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${strategy.title}`} />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title={`Edit ${strategy.title}`} description="Update this brand strategy's information" />
                    <Button variant="outline" onClick={() => router.get('/admin/brand-strategies')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Brand Strategies
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <BrandStrategyForm strategy={strategy} onSuccess={() => router.get('/admin/brand-strategies')} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
