import React from 'react';
import { twMerge } from 'tailwind-merge';

type PropsT = {
    children: React.ReactNode;
    className?: string;
};

export default function TableActionContainer({ children, className }: PropsT) {
    return <div className={twMerge(`flex w-0 items-center gap-4`, className)}>{children}</div>;
}
