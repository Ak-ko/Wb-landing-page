import { isLightColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { TeamMemberT } from '@/types';

interface PropsT {
    teamMember: TeamMemberT;
    varient?: 'compact' | 'expanded';
    onClick?: () => void;
}

export default function TeamMemberCard({ teamMember, varient = 'expanded', onClick }: PropsT) {
    const textColor = isLightColor(teamMember?.color as string) ? 'black' : 'white';
    const bgColor = teamMember?.color as string;

    return (
        <div
            style={{
                backgroundColor: bgColor,
            }}
            className={cn(
                'group overflow-hidden',
                varient === 'compact' ? 'max-h-[300px] rounded-none pt-5' : 'min-h-[350px] rounded-2xl px-9 pt-9',
                onClick && 'cursor-pointer transition-transform duration-300 hover:scale-105',
            )}
            onClick={onClick}
        >
            <div className={cn('flex items-center justify-center gap-5', varient === 'compact' ? 'flex-col' : 'flex-col lg:flex-row')}>
                {varient === 'compact' && (
                    <div
                        style={{
                            color: textColor,
                        }}
                        className={
                            'invisible h-full w-full max-w-[250px] -translate-y-[100px] scale-0 space-y-2 object-cover pb-5 text-center opacity-0 transition-all duration-500 group-hover:visible group-hover:translate-y-0 group-hover:scale-[1] group-hover:opacity-100'
                        }
                    >
                        <h1 className="text-xl font-bold uppercase">{teamMember?.name}</h1>
                        <p className="text-sm font-semibold uppercase">{teamMember?.designation}</p>
                    </div>
                )}

                <div className="relative flex shrink-0 flex-col">
                    <img
                        src={teamMember?.image}
                        className={cn(
                            'invisible absolute left-1/2 shrink-0 -translate-x-1/2 translate-y-[100px] scale-0 object-cover opacity-0 transition-all duration-500 group-hover:visible group-hover:translate-y-0 group-hover:scale-[1] group-hover:opacity-100',
                            varient === 'compact' ? 'max-w-[210px] !-translate-y-6.5' : 'max-w-[320px]',
                        )}
                        alt="human-image"
                    />
                    <img
                        src={teamMember?.mascot_image}
                        className={cn(
                            'visible shrink-0 scale-[1] opacity-100 transition-all duration-500 group-hover:invisible group-hover:-translate-y-[100%] group-hover:scale-[0] group-hover:opacity-0',
                            varient === 'compact' ? 'max-w-[210px] -translate-y-6.5' : 'max-w-[320px] translate-y-0',
                        )}
                        alt="mascot-image"
                    />
                </div>

                {varient === 'expanded' && (
                    <div
                        style={{
                            color: textColor,
                        }}
                        className="relative z-[2] space-y-2 text-center lg:text-start"
                    >
                        <h1 className="text-2xl font-bold uppercase">{teamMember?.name}</h1>
                        <p className="text-md font-semibold uppercase">{teamMember?.designation}</p>
                        {teamMember?.bio && <p className="line-clamp-[6] text-sm font-light">{teamMember?.bio}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
