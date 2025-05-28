import { cn } from '@/lib/utils';
import { TeamMemberT } from '@/types';
import { useId, useMemo, useState } from 'react';
import { Switch } from '../ui/switch';

interface PropsT {
    selectedTeamMember: TeamMemberT;
    onChange: (selectedTeamMember: TeamMemberT, checked: boolean) => void;
}

export default function ProjectLeadCard({ selectedTeamMember, onChange }: PropsT) {
    const [checked, setChecked] = useState(false);
    const id = useId();

    const handleChange = (_checked: boolean) => {
        setChecked(_checked);
        onChange(selectedTeamMember, _checked);
    };

    const isChecked = useMemo(() => {
        return selectedTeamMember?.pivot?.is_lead || checked;
    }, [selectedTeamMember, checked]);

    return (
        <div key={selectedTeamMember?.id} className="rounded-lg border p-2 shadow transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img className="size-[40px] rounded-full" src={selectedTeamMember?.image} />
                    <h1 className="text-sm font-semibold">{selectedTeamMember?.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Switch id={`is_lead${id}`} checked={isChecked} onCheckedChange={handleChange} />
                    <label htmlFor={`is_lead${id}`} className={cn('cursor-pointer text-sm', isChecked ? 'text-green-500' : 'text-black')}>
                        Lead
                    </label>
                </div>
            </div>
        </div>
    );
}
