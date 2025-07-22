import { scrollUpVarients } from '@/lib/animation-varients';
import { isLightColor } from '@/lib/colors';
import { TagT } from '@/types';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProjectTagProps {
    tag: TagT;
    tagCount?: number;
    className?: string;
    clickable?: boolean;
    showAnimation?: boolean;
}

export default function ProjectTag({ tag, tagCount, className = '', clickable = true, showAnimation = true }: ProjectTagProps) {
    const [showAlternate, setShowAlternate] = useState(false);
    const isLight = isLightColor(tag.color);
    const textColor = isLight ? 'text-gray-800' : 'text-white';

    useEffect(() => {
        if (!showAnimation || !tagCount || tagCount <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setShowAlternate((prev) => !prev);
        }, 3000);

        return () => clearInterval(interval);
    }, [tagCount, showAnimation]);

    const tagContent = (
        <div
            className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                clickable ? 'cursor-pointer hover:scale-105' : ''
            } ${textColor} ${className}`}
            style={{ backgroundColor: tag.color }}
        >
            {showAnimation ? (
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
            ) : (
                <span className="text-sm font-semibold tracking-wider uppercase">{tag.name}</span>
            )}
        </div>
    );

    if (!clickable) {
        return tagContent;
    }

    return (
        <Link href={route('branding-projects.list', { tag: tag.id })} className="inline-block">
            {tagContent}
        </Link>
    );
}
