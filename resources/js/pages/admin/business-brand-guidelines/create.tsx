import BusinessBrandGuidelineForm from '@/components/app/admin/business-brand-guideline/business-brand-guideline-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Business Brand Guidelines', href: '/admin/business-brand-guidelines' },
    { title: 'Create', href: '/admin/business-brand-guidelines/create' },
];

export default function CreateBusinessBrandGuideline() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Business Brand Guideline" />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Create Business Brand Guideline" />
                    <Button variant="outline" onClick={() => router.get('/admin/business-brand-guidelines')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <BusinessBrandGuidelineForm onSuccess={() => router.visit('/admin/business-brand-guidelines')} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
