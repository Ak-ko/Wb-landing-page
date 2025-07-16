import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
}

interface ThemedAccordionProps {
    items: AccordionItem[];
    className?: string;
}

export default function ThemedAccordion({ items, className = '' }: ThemedAccordionProps) {
    const [openItems, setOpenItems] = useState<string[]>(items.length > 0 ? [items[0].id] : []);

    const toggleItem = (itemId: string) => {
        setOpenItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {items.map((item) => {
                const isOpen = openItems.includes(item.id);
                
                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                        <button
                            onClick={() => toggleItem(item.id)}
                            className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0"
                            >
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                            </motion.div>
                        </button>
                        
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                                        {item.content}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
} 