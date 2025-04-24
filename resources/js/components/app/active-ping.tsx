import { cn } from '@/lib/utils';

interface PropsT {
    outerClassName?: string;
    innerClassName?: string;
    containerClassName?: string;
}

export default function ActivePing({ containerClassName, innerClassName, outerClassName }: PropsT) {
    return (
        <div className={cn('relative flex h-[10px] w-[10px] items-center justify-center', containerClassName)}>
            <div className={cn('absolute h-full w-full animate-ping rounded-full bg-green-500 opacity-75', outerClassName)}></div>
            <div className={cn('relative h-[7px] w-[7px] rounded-full bg-green-500', innerClassName)} />
        </div>
    );
}
