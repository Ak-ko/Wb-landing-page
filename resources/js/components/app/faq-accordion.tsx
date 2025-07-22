import { cn } from '@/lib/utils';
import { FaqT } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FaqAccordionProps {
    faqs: FaqT[];
}

interface FaqAccordionItemProps {
    faq: FaqT;
    isOpen: boolean;
    onClick: () => void;
    index: number;
}

function FaqAccordionItem({ faq, isOpen, onClick, index }: FaqAccordionItemProps) {
    return (
        <motion.div
            className="bg-gray-100/50"
            style={{
                borderLeftWidth: 4,
                borderLeftColor: faq.color || '#3b82f6',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut',
            }}
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
            }}
        >
            <div
                className={cn(
                    'relative cursor-pointer pl-6',
                    "before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:content-['']",
                )}
                onClick={onClick}
            >
                <div className="flex items-center justify-between py-4">
                    <h3 className="flex-1 text-lg font-medium select-none">{faq.question}</h3>
                    <motion.div animate={{ rotateX: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="mr-3" style={{ color: faq.color || '#3b82f6' }} />
                    </motion.div>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden pr-4"
                    >
                        <motion.div
                            className="prose prose-sm max-w-none px-8 pb-4"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <motion.div className={`w-full max-w-3xl space-y-3`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {faqs.map((faq, index) => (
                <FaqAccordionItem key={faq.id} faq={faq} isOpen={openIndex === index} onClick={() => handleToggle(index)} index={index} />
            ))}
        </motion.div>
    );
}
