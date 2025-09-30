import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface PropsT {
    href: string;
    className?: string;
    initialChildren: React.ReactNode;
    hoverChildren: React.ReactNode;
    initialColor?: string;
}

export default function HeroSectionBtn({ href, initialChildren, initialColor = 'black', hoverChildren, className }: PropsT) {
    const buttonClass = cn(
        'group relative min-h-[70px] w-full max-w-[300px] rounded-lg bg-black px-[130px] text-center text-[14.5px] text-black uppercase transition-all duration-500 sm:max-w-[240px]',
        initialColor && `bg-${initialColor}`,
        className,
    );

    return (
        <Link className={buttonClass} href={href}>
            {initialChildren && (
                <p className="visible absolute top-1/2 left-0 h-full w-full -translate-y-[23px] pt-0.5 text-white opacity-100 transition-all duration-500 group-hover:invisible group-hover:opacity-0 group-active:invisible group-active:opacity-0">
                    {initialChildren}
                </p>
            )}

            {hoverChildren && (
                <p className="invisible absolute top-1/2 left-0 h-full w-full -translate-y-[23px] text-white opacity-0 transition-all duration-500 group-hover:visible group-hover:opacity-100 group-active:visible group-active:opacity-100">
                    {hoverChildren}
                </p>
            )}
        </Link>
    );
}
