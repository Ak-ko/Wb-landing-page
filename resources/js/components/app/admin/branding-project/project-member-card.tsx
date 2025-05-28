import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TeamMemberT } from '@/types';
import { Link, Mail, Phone, Shield } from 'lucide-react';

interface PropsT {
    member: TeamMemberT;
}

export default function ProjectMember({ member }: PropsT) {
    const socialLinkObj = JSON.parse(member?.social_links as string);

    return (
        <Dialog>
            <DialogTrigger>
                <div className="relative cursor-pointer rounded-xl border p-3 transition-all duration-500 hover:-translate-y-3 hover:shadow-lg">
                    <div className="flex items-center gap-2">
                        <img className="size-[50px] rounded-full" src={member?.image} />
                        <h1 className="text-md font-semibold">{member?.name}</h1>
                    </div>

                    {!!member?.pivot?.is_lead && <Badge className="absolute top-2 right-2 text-xs">Project Lead</Badge>}
                </div>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle />
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <img className="size-[50px] rounded-full" src={member?.image} />
                            <h1 className="text-md font-semibold">{member?.name}</h1>
                        </div>
                        {!!member?.pivot?.is_lead && <Badge className="text-xs">Project Lead</Badge>}
                    </div>
                </DialogHeader>

                <DialogDescription />

                <div className="flex flex-col gap-2">
                    <div className="my-2 grid grid-cols-1 gap-5 rounded-lg border bg-gray-100 p-3 shadow-inner md:grid-cols-2">
                        <p className="flex items-center gap-2 text-sm font-bold">
                            <Shield />
                            {member.designation}
                        </p>

                        {member?.email && (
                            <p className="flex items-center gap-2 text-sm font-bold">
                                <Mail />
                                {member.email}
                            </p>
                        )}

                        {member?.phone && (
                            <p className="flex items-center gap-2 text-sm font-bold">
                                <Phone />
                                {member.phone}
                            </p>
                        )}

                        {member?.bio && (
                            <div className="col-span-2">
                                <hr className="my-4" />
                                <h2 className="mb-2 text-sm font-normal">Bio</h2>
                                <p className="flex items-center gap-2 text-sm font-bold">{member.bio}</p>
                            </div>
                        )}

                        {Object.entries(socialLinkObj)?.length > 0 && (
                            <div className="col-span-2">
                                <hr className="my-4" />
                                <h2 className="mb-2 text-sm font-normal">Social Links</h2>
                                <div className="space-y-1">
                                    {Object.keys(socialLinkObj).map((key) => (
                                        <p key={key} className="flex items-center gap-2 text-sm font-bold">
                                            <a
                                                href={socialLinkObj[key]}
                                                className="flex items-center gap-1"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Link className="size-3" />
                                                {key}
                                            </a>
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
