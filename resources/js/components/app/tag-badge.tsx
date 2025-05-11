import { scrollUpVarients } from '@/lib/animation-varients';
import { isLightColor } from '@/lib/colors';
import { TagT } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TagBadgeProps {
    tag: TagT;
    tagCount?: number;
    className?: string;
}

export default function TagBadge({ tag, tagCount, className = '' }: TagBadgeProps) {
    const [showAlternate, setShowAlternate] = useState(false);
    const isLight = isLightColor(tag.color);
    const textColor = isLight ? 'text-gray-800' : 'text-white';

    useEffect(() => {
        if (!tagCount || tagCount <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setShowAlternate((prev) => !prev);
        }, 3000);

        return () => clearInterval(interval);
    }, [tagCount]);

    return (
        <div
            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${textColor} ${className}`}
            style={{ backgroundColor: tag.color }}
        >
            <div className="relative h-6 overflow-hidden">
                <AnimatePresence initial={false}>
                    <motion.span
                        key={showAlternate ? 'alternate' : 'name'}
                        variants={scrollUpVarients}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="flex items-center justify-center text-sm font-semibold tracking-wider uppercase"
                        style={{
                            color: textColor,
                        }}
                    >
                        {tag.name}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
}
