import TeamMemberForm from '@/components/app/admin/team-members/team-member-form';
import DashboardTitle from '@/components/app/dashboard-title';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team Members',
        href: '/admin/team-members',
    },
    {
        title: 'Create',
        href: '/admin/team-members/create',
    },
];

export default function CreateTeamMember() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Team Member" />
            <DashboardTitle title="Create Team Member" />
            <div className="mx-auto max-w-2xl">
                <TeamMemberForm onSuccess={() => window.history.back()} />
            </div>
        </AppLayout>
    );
}
