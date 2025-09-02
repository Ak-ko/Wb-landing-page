import { Head, router } from '@inertiajs/react';

import ExpertiseSectionForm from '@/components/app/admin/expertise-sections/expertise-section-form';
import DashboardTitle from '@/components/app/dashboard-title';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Expertise Sections',
        href: '/admin/expertise-sections',
    },
    {
        title: 'Create',
        href: '/admin/expertise-sections/create',
    },
];

export default function CreateExpertiseSection() {
    const handleSuccess = () => {
        router.visit(route('expertise-sections.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Expertise Section" />

            <div className="space-y-4 p-4">
                <DashboardTitle title="Create Expertise Section" description="Add a new expertise section to your home page" />

                <div className="max-w-2xl">
                    <ExpertiseSectionForm onSuccess={handleSuccess} />
                </div>
            </div>
        </AppLayout>
    );
}
