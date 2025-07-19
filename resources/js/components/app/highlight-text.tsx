import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface PropsT {
    content: string;
    onClick?: () => void;
    highlightClassName?: string;
    contentClassName?: string;
}

const HighlightText = ({ content, onClick, highlightClassName, contentClassName }: PropsT) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { amount: 0.5 });

    return (
        <span
            ref={ref}
            className="group hover:shadow-secondary-pink/20 relative inline-block cursor-pointer overflow-hidden px-1 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            onClick={onClick}
        >
            <motion.span
                animate={{ scaleX: isInView ? 1 : 0, skewY: isInView ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className={cn('bg-secondary-pink absolute inset-0 z-0 h-full w-full origin-left', highlightClassName)}
            />

            <motion.span
                initial={{ color: 'black' }}
                animate={{ color: isInView ? 'white' : 'black' }}
                className={cn('relative z-10 text-black/60 transition-all duration-500', contentClassName)}
            >
                {content}
            </motion.span>
        </span>
    );
};

export default HighlightText;
