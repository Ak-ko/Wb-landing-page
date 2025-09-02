import TermsPolicyCard from '@/components/app/admin/terms-policies/terms-policy-card';
import DashboardTitle from '@/components/app/dashboard-title';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface CompanyPolicy {
    id?: number;
    terms_and_conditions: string | null;
    terms_and_conditions_for_art_services: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Policies', href: '/admin/terms-policies' }];

export default function AdminTermsPoliciesPage({ policy }: { policy: CompanyPolicy | null }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Policies" />
            <div className="space-y-6 p-6">
                <DashboardTitle title="Policies" description="Manage your terms and conditions for branding and art services" />

                <div className="grid gap-6 md:grid-cols-2">
                    <TermsPolicyCard title="Branding Terms & Conditions" content={policy?.terms_and_conditions || null} type="terms_and_conditions" />
                    <TermsPolicyCard
                        title="Art Services Terms & Conditions"
                        content={policy?.terms_and_conditions_for_art_services || null}
                        type="terms_and_conditions_for_art_services"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
