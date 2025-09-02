import { Head, router } from '@inertiajs/react';

import ExpertiseSectionForm from '@/components/app/admin/expertise-sections/expertise-section-form';
import DashboardTitle from '@/components/app/dashboard-title';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface ExpertiseSectionT {
    id: number;
    title: string;
    type: 'business' | 'established';
    plans: { text: string; order: number }[];
    color: string;
    order: number;
    is_active: boolean;
}

const breadcrumbs = (section: ExpertiseSectionT): BreadcrumbItem[] => [
    {
        title: 'Expertise Sections',
        href: '/admin/expertise-sections',
    },
    {
        title: section.title,
        href: `/admin/expertise-sections/${section.id}`,
    },
    {
        title: 'Edit',
        href: `/admin/expertise-sections/${section.id}/edit`,
    },
];

export default function EditExpertiseSection({ expertiseSection }: { expertiseSection: ExpertiseSectionT }) {
    const handleSuccess = () => {
        router.visit(route('expertise-sections.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(expertiseSection)}>
            <Head title={`Edit ${expertiseSection.title}`} />

            <div className="space-y-4 p-4">
                <DashboardTitle title={`Edit ${expertiseSection.title}`} description="Update the expertise section details" />

                <div className="max-w-2xl">
                    <ExpertiseSectionForm expertiseSection={expertiseSection} onSuccess={handleSuccess} />
                </div>
            </div>
        </AppLayout>
    );
}
