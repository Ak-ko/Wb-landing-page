import { cn } from '@/lib/utils';

interface PropsT {
    content: string;
    onClick?: () => void;
    highlightClassName?: string;
    contentClassName?: string;
}

const HighlightText = ({ content, onClick, highlightClassName, contentClassName }: PropsT) => (
    <span className="group relative inline-block cursor-pointer overflow-hidden px-1" onClick={onClick}>
        <span
            className={cn(
                'bg-secondary-pink absolute inset-0 z-0 h-full w-full origin-left scale-x-0 -skew-y-[0.2deg] transition-all duration-500 group-hover:scale-x-[1]',
                highlightClassName,
            )}
        />

        <span className={cn('relative z-10 text-black/60 transition-all duration-500 group-hover:text-white', contentClassName)}>{content}</span>
    </span>
);

export default HighlightText;
