import { TeamMemberT } from '@/types';
import { usePage } from '@inertiajs/react';

import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';
import TeamMemberCard from './team-member-card';

export default function TeamMembersSection() {
    const { teamMembers } = usePage<{ teamMembers: TeamMemberT[] }>().props;

    if (!teamMembers || teamMembers?.length === 0) return null;

    const topTeamMembers = teamMembers?.slice(0, 1);
    const bottomTeamMembers = teamMembers?.slice(1);

    return (
        <section className="py-32">
            <div className="app-container">
                <SectionHeader header="Meet the walking gang" />

                <div className="grid grid-cols-1 gap-4 py-11 xl:grid-cols-2">
                    {topTeamMembers?.map((t, x) => <TeamMemberCard key={x} teamMember={t} />)}
                </div>
            </div>

            <CommonBodyAnimation>
                {bottomTeamMembers?.length > 0 && (
                    <div className="grid grid-cols-1 py-20 md:grid-cols-5 lg:grid-cols-5 2xl:grid-cols-6">
                        {bottomTeamMembers?.map((t, x) => <TeamMemberCard key={x} teamMember={t} varient="compact" />)}
                    </div>
                )}
            </CommonBodyAnimation>
        </section>
    );
}
