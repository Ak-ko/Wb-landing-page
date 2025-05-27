import { motion } from 'framer-motion';

interface PropsT {
    content: string;
    onClick?: () => void;
}

const HighlightText = ({ content, onClick }: PropsT) => (
    <span className="relative inline-block cursor-pointer px-1" onClick={onClick}>
        {/* Container to clip the animated background */}
        <span className="relative z-10">{content}</span>

        <motion.span
            className="absolute top-0 left-0 z-0 h-full w-full bg-blue-200"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
                transformOrigin: 'left',
                transform: 'skewX(-12deg)',
            }}
        />
    </span>
);

export default HighlightText;
