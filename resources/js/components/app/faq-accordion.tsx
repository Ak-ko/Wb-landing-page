import { cn } from '@/lib/utils';
import { FaqT } from '@/types';
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

                {isOpen && (
                    <div className="pr-4 pb-4">
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={`w-full max-w-3xl`}>
            {faqs.map((faq, index) => (
                <FaqAccordionItem key={faq.id} faq={faq} isOpen={openIndex === index} onClick={() => handleToggle(index)} />
            ))}
        </div>
    );
}
