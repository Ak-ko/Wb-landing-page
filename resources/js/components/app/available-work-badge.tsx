import { cn } from '@/lib/utils';

interface PropsT {
    label: string;
    className?: string;
}

export default function AvailableWorkBadge({ label, className }: PropsT) {
    return <div className={cn('bg-primary inline-block rounded-full px-4 py-2', className)}>{label}</div>;
}
