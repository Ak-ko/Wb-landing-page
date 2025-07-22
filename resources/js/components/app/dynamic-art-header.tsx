import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import React from 'react';

interface PropsT {
    title: string | React.ReactNode;
    description: string;
    titleClass?: string;
    descriptionClass?: string;
    containerClass?: string;
    initialAnimationProperty?: {
        x: number;
        opacity: number;
    };
}

export default function DynamicArtHeader({
    title,
    description,
    initialAnimationProperty = {
        x: -100,
        opacity: 0,
    },
    titleClass,
    descriptionClass,
    containerClass,
}: PropsT) {
    return (
        <div className={cn('bg-black px-10 py-15 sm:px-22 sm:py-32', containerClass)}>
            <motion.div
                initial={initialAnimationProperty}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.95, type: 'ease-out' }}
                className="app-container"
            >
                <h1 className={cn('mb-3 text-center text-[50px] font-bold text-white uppercase sm:text-[80px]', titleClass)}>{title}</h1>
                <p className={cn('mx-auto max-w-[650px] text-center text-lg leading-[2] text-white', descriptionClass)}>{description}</p>
            </motion.div>
        </div>
    );
}
