import { cn } from '@/lib/utils';

interface PropsT {
    label: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function AvailableWorkBadge({ label, className, style }: PropsT) {
    return (
        <div className={cn('inline-block rounded-full px-4 py-2', className)} style={style}>
            {label}
        </div>
    );
}
