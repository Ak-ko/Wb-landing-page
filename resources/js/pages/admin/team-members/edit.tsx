import TeamMemberForm from '@/components/app/admin/team-members/team-member-form';
import DashboardTitle from '@/components/app/dashboard-title';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TeamMemberT } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team Members',
        href: '/admin/team-members',
    },
    {
        title: 'Edit',
        href: '#', // Or a dynamic link if needed
    },
];

export default function EditTeamMember({ teamMember }: { teamMember: TeamMemberT }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${teamMember.name}`} />
            <DashboardTitle title={`Edit Team Member: ${teamMember.name}`} />
            <div className="mx-auto max-w-2xl">
                <TeamMemberForm teamMember={teamMember} onSuccess={() => window.history.back()} />
            </div>
        </AppLayout>
    );
}
