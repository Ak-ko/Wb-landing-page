import { TeamMemberT } from '@/types';
import { usePage } from '@inertiajs/react';

import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';
import TeamMemberCard from './team-member-card';

export default function TeamMembersSection() {
    const { teamMembers } = usePage<{ teamMembers: TeamMemberT[] }>().props;

    if (!teamMembers || teamMembers?.length === 0) return null;

    const starTeamMember = teamMembers?.find((member) => member.type === 'star_member');
    const regularTeamMembers = teamMembers?.filter((member) => member.type === 'member');

    return (
        <section className="py-32">
            <div className="app-container">
                <SectionHeader header="Meet the walking gang" />

                {starTeamMember && (
                    <div className="grid grid-cols-1 gap-4 py-11 xl:grid-cols-2">
                        <TeamMemberCard teamMember={starTeamMember} />
                    </div>
                )}
            </div>

            <CommonBodyAnimation>
                {regularTeamMembers && regularTeamMembers.length > 0 && (
                    <div className="grid grid-cols-1 py-20 md:grid-cols-5 lg:grid-cols-5 2xl:grid-cols-6">
                        {regularTeamMembers.map((member, index) => (
                            <TeamMemberCard key={index} teamMember={member} varient="compact" />
                        ))}
                    </div>
                )}
            </CommonBodyAnimation>
        </section>
    );
}
