import { isLightColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { TeamMemberT } from '@/types';

interface PropsT {
    teamMember: TeamMemberT;
    varient?: 'compact' | 'expanded';
}

export default function TeamMemberCard({ teamMember, varient = 'expanded' }: PropsT) {
    const textColor = isLightColor(teamMember?.color as string) ? 'black' : 'white';
    const bgColor = teamMember?.color as string;

    return (
        <div
            style={{
                backgroundColor: bgColor,
            }}
            className={cn('group overflow-hidden', varient === 'compact' ? 'h-[300px] rounded-none pt-5' : 'min-h-[350px] rounded-2xl px-9 pt-9')}
        >
            <div className={cn('flex items-center justify-center gap-5', varient === 'compact' ? 'flex-col' : 'flex-col lg:flex-row')}>
                {varient === 'compact' && (
                    <div
                        style={{
                            color: textColor,
                        }}
                        className={
                            'invisible h-full w-full max-w-[250px] -translate-y-[100px] scale-0 space-y-2 object-cover pb-5 text-center opacity-0 transition-all duration-500 group-hover:visible group-hover:translate-y-[20px] group-hover:scale-[1] group-hover:opacity-100'
                        }
                    >
                        <h1 className="text-3xl font-bold uppercase">{teamMember?.name}</h1>
                        <p className="text-lg font-semibold uppercase">{teamMember?.designation}</p>
                    </div>
                )}

                <div className="relative flex shrink-0 flex-col">
                    <img
                        src={teamMember?.image}
                        className="invisible absolute left-1/2 h-full w-full max-w-[250px] -translate-x-1/2 -translate-y-[100px] scale-0 object-cover opacity-0 transition-all duration-500 group-hover:visible group-hover:translate-y-0 group-hover:scale-[1] group-hover:opacity-100"
                        alt="mascot-image"
                    />
                    <img
                        src={teamMember?.mascot_image}
                        className={cn(
                            'visible scale-[1] opacity-100 transition-all duration-500 group-hover:invisible group-hover:translate-y-[100%] group-hover:scale-[0] group-hover:opacity-0',
                            varient === 'compact' ? 'max-w-[250px] -translate-y-[80px]' : 'max-w-[320px] translate-y-0',
                        )}
                        alt="mascot-image"
                    />
                </div>

                {varient === 'expanded' && (
                    <div
                        style={{
                            color: textColor,
                        }}
                        className="space-y-2 pb-5 text-center lg:text-start"
                    >
                        <h1 className="text-3xl font-bold uppercase">{teamMember?.name}</h1>
                        <p className="text-lg font-semibold uppercase">{teamMember?.designation}</p>
                        {teamMember?.bio && <p className="line-clamp-[6] text-sm">{teamMember?.bio}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
