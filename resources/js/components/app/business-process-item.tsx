import { useIsMobile } from '@/hooks/use-mobile';
import { isLightColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { BusinessProcessT } from '@/types';
import { motion } from 'framer-motion';
import WalkingProcess from './icons/walking-process';

interface BusinessProcessItemProps {
    businessProcess: BusinessProcessT;
    isActive: boolean;
    index: number;
    totalItems: number;
    scrollDirection: 'up' | 'down';
}

export default function BusinessProcessItem({ businessProcess }: BusinessProcessItemProps) {
    const isMobile = useIsMobile();

    // Mobile Layout
    if (isMobile) {
        return (
            <motion.div
                id={`process-${businessProcess.id}`}
                className="flex w-full flex-col items-center justify-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative flex w-full max-w-sm flex-col items-center gap-6">
                    {/* Image */}
                    <div className="w-full">
                        {businessProcess?.image && (
                            <motion.div
                                className="relative w-full"
                                initial={{ scale: 0.95, opacity: 0.8 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                <img
                                    className="relative z-10 w-full rounded-2xl object-cover shadow-lg"
                                    src={businessProcess.image}
                                    alt={businessProcess.title}
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Step Badge */}
                    <motion.div
                        className="rounded-lg px-4 py-2 shadow-lg"
                        style={{ backgroundColor: businessProcess?.color_tag }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <span className={cn('text-lg font-bold', isLightColor(businessProcess?.color_tag) ? 'text-black' : 'text-white')}>
                            STEP {String(businessProcess?.step).padStart(2, '0')}
                        </span>
                    </motion.div>

                    {/* Text content */}
                    <motion.div
                        className="w-full text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h1 className="mb-4 text-2xl font-bold uppercase dark:text-white" style={{ color: businessProcess.color_tag }}>
                            {businessProcess?.title}
                        </h1>
                        <p className="text-sm leading-[1.7] text-gray-700 dark:text-gray-300">{businessProcess?.description}</p>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    // Desktop Layout
    return (
        <motion.div
            id={`process-${businessProcess.id}`}
            className="flex w-full flex-col items-center justify-center px-4 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative grid w-full max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-3 md:gap-12">
                {/* Image - First on mobile */}
                <div className="order-1 flex justify-center md:order-1">
                    {businessProcess?.image && (
                        <motion.div
                            className="relative w-full max-w-[280px] md:max-w-[400px]"
                            initial={{ scale: 0.95, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            <img
                                className="relative z-10 w-full rounded-2xl object-cover shadow-lg"
                                src={businessProcess.image}
                                alt={businessProcess.title}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Step circle - Second on mobile */}
                <div className="order-2 flex justify-center md:order-2">
                    <motion.div
                        className="relative flex h-[140px] w-[140px] items-center justify-center md:h-[180px] md:w-[180px]"
                        initial={{ rotate: -5, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <WalkingProcess className="size-[160px]" color={businessProcess?.color_tag} />
                        <div
                            className={cn(
                                'absolute inset-0 flex translate-y-[-15%] flex-col items-center justify-center',
                                isLightColor(businessProcess?.color_tag) ? 'text-black' : 'text-white',
                            )}
                        >
                            <motion.h1
                                className="text-center text-xl font-bold md:text-2xl"
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                STEP
                            </motion.h1>
                            <motion.h1
                                className="mr-1 text-center text-xl font-bold md:text-3xl"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                {String(businessProcess?.step).padStart(2, '0')}
                            </motion.h1>
                        </div>
                    </motion.div>
                </div>

                {/* Text content - Third on mobile */}
                <div className="order-3 flex justify-center md:order-3 md:justify-start md:text-left">
                    <motion.div
                        className="w-full max-w-[320px] text-center md:max-w-[400px] md:text-left"
                        initial={{ y: isMobile ? 20 : 0, x: isMobile ? 0 : businessProcess.step % 2 === 0 ? 20 : -20, opacity: 0 }}
                        animate={{ y: 0, x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1
                            className="relative mb-4 inline-block text-2xl font-bold uppercase md:mb-6 md:text-3xl dark:text-white"
                            style={{
                                color: businessProcess.color_tag,
                            }}
                        >
                            {businessProcess?.title}
                        </h1>
                        <p className="text-sm leading-[1.7] font-light text-gray-700 md:text-base dark:text-gray-300">
                            {businessProcess?.description}
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
