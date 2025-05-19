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
}

function FaqAccordionItem({ faq, isOpen, onClick }: FaqAccordionItemProps) {
    return (
        <div
            className="bg-gray-100/50"
            style={{
                borderLeftWidth: 4,
                borderLeftColor: faq.color || '#3b82f6',
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
                    <ChevronDown
                        className={cn('mr-3 transition-transform duration-200', isOpen ? 'rotate-180' : 'rotate-0')}
                        style={{ color: faq.color || '#3b82f6' }}
                    />
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden pr-4"
                    >
                        <div className="prose prose-sm max-w-none px-8 pb-4" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={`w-full max-w-3xl space-y-3`}>
            {faqs.map((faq, index) => (
                <FaqAccordionItem key={faq.id} faq={faq} isOpen={openIndex === index} onClick={() => handleToggle(index)} />
            ))}
        </div>
    );
}
