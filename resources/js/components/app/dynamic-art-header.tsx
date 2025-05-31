import { cn } from '@/lib/utils';
import React from 'react';

interface PropsT {
    title: string | React.ReactNode;
    description: string;
    titleClass?: string;
    descriptionClass?: string;
    containerClass?: string;
}

export default function DynamicArtHeader({ title, description, titleClass, descriptionClass, containerClass }: PropsT) {
    return (
        <div className={cn('bg-black p-22', containerClass)}>
            <div className="app-container">
                <h1 className={cn('mb-3 text-[75px] font-bold text-white uppercase sm:text-[80px]', titleClass)}>{title}</h1>
                <p className={cn('max-w-[650px] text-lg leading-[2] text-white', descriptionClass)}>{description}</p>
            </div>
        </div>
    );
}
