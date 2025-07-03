import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import CloseQuote from './icons/close-quote';
import OpenQuote from './icons/open-quote';

interface PropsT {
    title: React.ReactNode | string;
    description: string;
    image: string;
    containerClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    imageClassName?: string;
    isReversed?: boolean;
}

export default function AboutUsIntroContent({
    title,
    description,
    image,
    containerClassName,
    titleClassName,
    descriptionClassName,
    imageClassName,
    isReversed = false,
}: PropsT) {
    // Animation variants for content
    const contentVariants = {
        hidden: { opacity: 0, x: isReversed ? 50 : -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
                staggerChildren: 0.2,
            },
        },
    };

    // Animation variants for child elements
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    // Animation variants for image
    const imageVariants = {
        hidden: { opacity: 0, scale: 0.9, x: isReversed ? -50 : 50 },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: 'easeOut',
                delay: 0.2,
            },
        },
    };

    return (
        <div
            className={cn(
                'flex flex-col justify-between gap-8 lg:flex-row lg:items-stretch',
                isReversed && 'lg:flex-row-reverse',
                containerClassName,
            )}
        >
            <motion.div variants={contentVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <motion.div className={`mb-2 flex ${isReversed ? 'justify-end' : 'justify-start'}`} variants={itemVariants}>
                    {isReversed ? (
                        <CloseQuote className="rotate-x-[180deg]" color="var(--primary-orange)" />
                    ) : (
                        <OpenQuote color="var(--primary-orange)" />
                    )}
                </motion.div>
                <motion.h1
                    className={cn('text-[40px] font-bold uppercase sm:text-[45px]', isReversed && 'text-end', titleClassName)}
                    variants={itemVariants}
                >
                    {title}
                </motion.h1>
                <motion.p
                    className={cn('leading-[1.5] font-light tracking-wide', isReversed && 'text-end', descriptionClassName)}
                    variants={itemVariants}
                >
                    {description}
                </motion.p>
            </motion.div>
            <motion.div className="shrink-0" variants={imageVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <img className={cn('!h-[300px] rounded-2xl object-cover lg:!w-[550px]', imageClassName)} src={image} alt="about us" />
            </motion.div>
        </div>
    );
}
