import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface PropsT {
    header: string | React.ReactNode;
    description?: string | React.ReactNode;
    headerClass?: string;
    descriptionClass?: string;
    containerClass?: string;
}

export default function SectionHeader({ header, headerClass, descriptionClass, description, containerClass }: PropsT) {
    return (
        <motion.div
            viewport={{ once: true }}
            initial={{ y: -80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.95, delay: 0.3, type: 'linear' }}
            className={cn('flex flex-col items-center justify-center gap-5 px-3 lg:px-0', containerClass)}
        >
            <h1 className={cn('text-center text-[40px] font-extrabold uppercase sm:text-[50px] 2xl:text-[90px]', headerClass)}>{header}</h1>
            {typeof description === 'string' ? (
                <p
                    className={cn(
                        'text-md font-inter max-w-[350px] text-center font-normal sm:!max-w-[800px] sm:text-lg 2xl:max-w-[500px] 2xl:!text-[45px]',
                        descriptionClass,
                    )}
                >
                    {description}
                </p>
            ) : (
                description
            )}
        </motion.div>
    );
}
