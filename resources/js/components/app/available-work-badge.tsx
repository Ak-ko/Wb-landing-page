import { cn } from '@/lib/utils';

interface PropsT {
    label: string;
    className?: string;
    style?: React.CSSProperties;
    textColor?: string;
}

export default function AvailableWorkBadge({ label, className, style, textColor }: PropsT) {
    return (
        <div
            className={cn('inline-block rounded-full px-4 py-2', className)}
            style={{
                ...style,
                color: textColor || style?.color || '#ffffff',
            }}
        >
            {label}
        </div>
    );
}
