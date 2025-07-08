import BusinessBrandGuidelineForm from '@/components/app/admin/business-brand-guideline/business-brand-guideline-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BusinessBrandGuidelineT } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface EditProps {
    guideline: BusinessBrandGuidelineT;
}

export default function EditBusinessBrandGuideline({ guideline }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Business Brand Guidelines', href: '/admin/business-brand-guidelines' },
        { title: 'Edit', href: `/admin/business-brand-guidelines/${guideline.id}/edit` },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Business Brand Guideline" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Edit Business Brand Guideline" />
                    <Button variant="outline" onClick={() => router.get('/admin/business-brand-guidelines')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <BusinessBrandGuidelineForm guideline={guideline} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
