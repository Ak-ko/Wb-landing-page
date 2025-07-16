import BrandStrategyForm from '@/components/app/admin/brand-strategy/brand-strategy-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Brand Strategies',
        href: '/admin/brand-strategies',
    },
    {
        title: 'Create',
        href: '/admin/brand-strategies/create',
    },
];

export default function CreateBrandStrategy() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Brand Strategy" />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Create Brand Strategy" description="Add a new brand strategy" />
                    <Button variant="outline" onClick={() => router.get('/admin/brand-strategies')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Brand Strategies
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <BrandStrategyForm />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
