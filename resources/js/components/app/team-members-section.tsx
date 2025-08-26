import { TeamMemberT } from '@/types';
import { usePage } from '@inertiajs/react';
import { Facebook, Globe, Instagram, Linkedin, Mail, Phone, Star, Twitter, X } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '../ui/dialog';

import AboutUsHeader from './about-us-header';
import CommonBodyAnimation from './common-body-animation';
import TeamMemberCard from './team-member-card';

export default function TeamMembersSection() {
    const { teamMembers } = usePage<{ teamMembers: TeamMemberT[] }>().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMemberT | null>(null);

    const handleOpenDialog = (teamMember: TeamMemberT) => {
        setSelectedTeamMember(teamMember);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const getSocialIcon = (platform: string) => {
        const platformLower = platform.toLowerCase();
        if (platformLower.includes('linkedin')) return Linkedin;
        if (platformLower.includes('twitter') || platformLower.includes('x')) return Twitter;
        if (platformLower.includes('instagram')) return Instagram;
        if (platformLower.includes('facebook')) return Facebook;
        return Globe;
    };

    const renderSocialLinks = (socialLinks: string | string[] | null) => {
        if (!socialLinks) return null;

        if (typeof socialLinks === 'string') {
            const Icon = getSocialIcon(socialLinks);
            return (
                <a
                    href={socialLinks}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-white/20 p-3 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30"
                >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">Social Profile</span>
                </a>
            );
        }

        if (Array.isArray(socialLinks)) {
            return (
                <div className="flex flex-wrap gap-2">
                    {socialLinks.map((link, index) => {
                        const Icon = getSocialIcon(link);
                        return (
                            <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg bg-white/20 p-3 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        );
                    })}
                </div>
            );
        }

        return null;
    };

    if (!teamMembers || teamMembers?.length === 0) return null;

    const starTeamMembers = teamMembers?.filter((member) => member.type === 'star_member');
    const regularTeamMembers = teamMembers?.filter((member) => member.type === 'member');

    return (
        <>
            <section className="py-32">
                <AboutUsHeader />
                <div className="app-container">
                    {starTeamMembers && (
                        <div className="grid grid-cols-1 gap-4 py-11 xl:grid-cols-2">
                            {starTeamMembers.map((member, index) => (
                                <TeamMemberCard key={index} teamMember={member} onClick={() => handleOpenDialog(member)} />
                            ))}
                        </div>
                    )}
                </div>

                <CommonBodyAnimation>
                    {regularTeamMembers && regularTeamMembers.length > 0 && (
                        <div className="grid grid-cols-1 py-20 md:grid-cols-5 lg:grid-cols-5 2xl:grid-cols-6">
                            {regularTeamMembers.map((member, index) => (
                                <TeamMemberCard key={index} teamMember={member} varient="compact" onClick={() => handleOpenDialog(member)} />
                            ))}
                        </div>
                    )}
                </CommonBodyAnimation>
            </section>

            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogHeader>
                    <DialogTitle className="sr-only">Team Member Details</DialogTitle>
                </DialogHeader>
                <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
                <DialogContent showCloseBtn={false} className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-3xl border-0 p-0">
                    <DialogClose asChild>
                        <button
                            className="absolute top-4 right-4 z-[20] rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DialogClose>
                    {selectedTeamMember && (
                        <div className="relative h-full overflow-y-auto">
                            <div
                                className="absolute inset-0 z-0"
                                style={{
                                    background: `radial-gradient(circle at top right, ${selectedTeamMember.color || '#6366f1'}40, transparent 60%), 
                                                radial-gradient(circle at bottom left, ${selectedTeamMember.color || '#6366f1'}20, transparent 40%)`,
                                }}
                            />

                            <div className="relative z-10 p-6 md:p-8">
                                <div className="mb-6 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {selectedTeamMember.type === 'star_member' && (
                                            <div className="flex items-center gap-2 rounded-full bg-yellow-400/20 px-3 py-1 backdrop-blur-sm">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-semibold text-yellow-600">Star Member</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                                {selectedTeamMember.type === 'star_member' ? 'Star Member' : 'Team Member'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-8 lg:grid-cols-3">
                                    <div className="flex justify-center lg:col-span-1">
                                        <div className="relative">
                                            <div className="absolute -inset-2 rounded-full"></div>
                                            <img
                                                src={selectedTeamMember.image || selectedTeamMember.mascot_image}
                                                alt={selectedTeamMember.name}
                                                className="relative h-48 w-48 rounded-full border-4 border-white/50 object-cover shadow-2xl backdrop-blur-sm"
                                            />
                                            {selectedTeamMember.image && selectedTeamMember.mascot_image && (
                                                <div className="absolute -right-2 -bottom-2">
                                                    <div className="rounded-full bg-white/90 p-1 shadow-lg backdrop-blur-sm">
                                                        <img
                                                            src={selectedTeamMember.mascot_image}
                                                            alt={`${selectedTeamMember.name} mascot`}
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6 lg:col-span-2">
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 uppercase lg:text-4xl">
                                                {selectedTeamMember.name}
                                            </h2>
                                            <p
                                                className="text-xl font-semibold tracking-wide uppercase lg:text-2xl"
                                                style={{ color: selectedTeamMember.color || '#6366f1' }}
                                            >
                                                {selectedTeamMember.designation}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                {selectedTeamMember.email && (
                                                    <a
                                                        href={`mailto:${selectedTeamMember.email}`}
                                                        className="flex items-center gap-3 rounded-lg bg-white/20 p-3 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30"
                                                    >
                                                        <Mail className="h-4 w-4 text-gray-600" />
                                                        <span className="truncate text-sm text-gray-700">{selectedTeamMember.email}</span>
                                                    </a>
                                                )}
                                                {selectedTeamMember.phone && (
                                                    <a
                                                        href={`tel:${selectedTeamMember.phone}`}
                                                        className="flex items-center gap-3 rounded-lg bg-white/20 p-3 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30"
                                                    >
                                                        <Phone className="h-4 w-4 text-gray-600" />
                                                        <span className="text-sm text-gray-700">{selectedTeamMember.phone}</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {selectedTeamMember.social_links && (
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-semibold text-gray-700">Social Links</h3>
                                                {renderSocialLinks(selectedTeamMember.social_links)}
                                            </div>
                                        )}

                                        {selectedTeamMember.bio && (
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-semibold text-gray-700">About</h3>
                                                <div
                                                    className="max-h-64 overflow-y-auto rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur-sm"
                                                    style={{
                                                        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px ${selectedTeamMember.color || '#6366f1'}20`,
                                                    }}
                                                >
                                                    <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-700">
                                                        {selectedTeamMember.bio}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
