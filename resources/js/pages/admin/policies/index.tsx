import PolicyCard from '@/components/app/admin/policies/policy-card';
import DashboardTitle from '@/components/app/dashboard-title';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface CompanyPolicy {
    id?: number;
    mission: string | null;
    vision: string | null;
    core_values: string | null;
    terms_and_conditions: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Company Policies', href: '/admin/policies' }];

export default function AdminPoliciesPage({ policy }: { policy: CompanyPolicy | null }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Company Policies" />
            <div className="space-y-6 p-6">
                <DashboardTitle title="Company Policies" description="Manage your company's mission, vision, core values, and terms & conditions" />

                <div className="grid gap-6 md:grid-cols-2">
                    <PolicyCard title="Mission" content={policy?.mission || null} type="mission" />
                    <PolicyCard title="Vision" content={policy?.vision || null} type="vision" />
                    <PolicyCard title="Core Values" content={policy?.core_values || null} type="core_values" />
                    <PolicyCard title="Terms and Conditions" content={policy?.terms_and_conditions || null} type="terms_and_conditions" />
                </div>
            </div>
        </AppLayout>
    );
}
