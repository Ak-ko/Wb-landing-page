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

export default function BusinessProcessItem({ businessProcess, isActive, index, totalItems, scrollDirection }: BusinessProcessItemProps) {
    return (
        <motion.div
            id={`process-${businessProcess.id}`}
            className={`${isActive ? 'relative' : 'pointer-events-none absolute opacity-0'} flex w-full flex-col items-center justify-center px-4 sm:px-0`}
            initial={{
                opacity: 0,
                filter: 'blur(10px)',
                y: scrollDirection === 'down' ? 100 : -100,
            }}
            animate={
                isActive
                    ? { opacity: 1, filter: 'blur(0px)', y: 0, display: 'flex' }
                    : {
                          opacity: 0,
                          filter: 'blur(10px)',
                          y: scrollDirection === 'down' ? -100 : 100,
                          transitionEnd: { display: 'none' },
                      }
            }
            transition={{
                duration: 0.6,
                ease: 'easeInOut',
                opacity: { duration: 0.5 },
                filter: { duration: 0.6 },
                y: { duration: 0.4 },
            }}
        >
            <div className="relative grid w-full max-w-6xl grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-10">
                {/* Decorative line connecting steps */}
                {index < totalItems - 1 && (
                    <div className="from-primary/50 absolute top-full left-1/2 hidden h-32 w-0.5 -translate-x-1/2 bg-gradient-to-b to-transparent md:block"></div>
                )}

                <div
                    className={cn(
                        'order-2 flex justify-center md:order-1 md:justify-start',
                        businessProcess.step % 2 === 0 ? 'md:order-3' : 'md:order-1',
                    )}
                >
                    {businessProcess?.image && (
                        <motion.div
                            className="relative w-full max-w-[250px] md:max-w-[300px]"
                            initial={{ scale: 0.95, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <div className="from-primary/20 absolute inset-0 scale-105 rotate-3 transform rounded-2xl bg-gradient-to-tr to-transparent"></div>
                            <img
                                className="relative z-10 w-full rounded-2xl object-cover shadow-lg"
                                src={businessProcess.image}
                                alt={businessProcess.title}
                            />
                            <div className="bg-primary/10 absolute -right-3 -bottom-3 h-16 w-16 rounded-full blur-xl"></div>
                        </motion.div>
                    )}
                </div>

                <div className="order-1 flex justify-center md:order-2">
                    <motion.div
                        className="relative flex h-[150px] w-[150px] items-center justify-center md:h-[200px] md:w-[200px]"
                        initial={{ rotate: -5 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                    >
                        <div className="bg-primary/5 absolute inset-0 scale-110 transform animate-pulse rounded-full"></div>
                        <WalkingProcess color={businessProcess?.color_tag} />
                        <div
                            className={cn(
                                'absolute inset-0 flex translate-y-[-15%] flex-col items-center justify-center',
                                isLightColor(businessProcess?.color_tag) ? 'text-black' : 'text-white',
                            )}
                        >
                            <motion.h1
                                className="text-2xl font-bold md:text-3xl"
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                STEP
                            </motion.h1>
                            <motion.h1
                                className="text-2xl font-bold md:text-4xl"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                {String(businessProcess?.step).padStart(2, '0')}
                            </motion.h1>
                        </div>
                    </motion.div>
                </div>

                <div
                    className={cn(
                        'order-3 flex justify-center md:justify-start',
                        businessProcess.step % 2 === 0 ? 'md:order-1' : 'md:order-3',
                        businessProcess.step % 2 === 0 ? 'md:text-right' : 'md:text-left',
                    )}
                >
                    <motion.div
                        className="w-full max-w-[300px] text-center md:max-w-[400px] md:text-inherit"
                        initial={{ x: businessProcess.step % 2 === 0 ? 20 : -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <h1 className="relative mb-2 inline-block text-3xl font-bold text-black uppercase md:mb-4 md:text-3xl dark:text-white">
                            {businessProcess?.title}
                            <span className="bg-primary/30 absolute -bottom-1 left-0 h-1 w-full rounded-full"></span>
                        </h1>
                        <p className="text-sm leading-[1.6] text-black md:text-base dark:text-white">{businessProcess?.description}</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
