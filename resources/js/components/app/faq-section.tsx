import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import CustomModal from '../ui/custom-modal';
import CommonBodyAnimation from './common-body-animation';
import FaqAccordion from './faq-accordion';
import FaqUserForm from './faq-user-form';
import SectionHeader from './section-header';

import { FaqT } from '@/types';
import { usePage } from '@inertiajs/react';

const INITIAL_FAQ_COUNT = 10;

export default function FaqSection() {
    const { faqs } = usePage<{ faqs: FaqT[] }>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allFaqs, setAllFaqs] = useState<FaqT[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const hasMoreFaqs = faqs.length >= INITIAL_FAQ_COUNT;

    const handleSeeMoreClick = async () => {
        if (allFaqs.length === 0) {
            setIsLoading(true);
            try {
                const res = await axios.get('/faq/all');
                if (res.data) {
                    setAllFaqs(res.data);
                }
            } catch (error) {
                console.error('Error fetching all FAQs:', error);
            } finally {
                setIsLoading(false);
            }
        }
        setIsModalOpen(true);
    };

    return (
        <section id="faqSection" className="">
            <div className="app-container">
                <SectionHeader header="Commonly Asked Questions" containerClass="!justify-start !items-start" headerClass="!lg:text-start" />

                <CommonBodyAnimation>
                    <div className="flex flex-col lg:flex-row">
                        <div className="basis-[80%]">
                            {faqs.length > 0 && (
                                <div className="mt-8">
                                    <FaqAccordion faqs={faqs} />
                                    {hasMoreFaqs && (
                                        <motion.div
                                            className="mt-6 max-w-[768px] text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <motion.button
                                                onClick={handleSeeMoreClick}
                                                disabled={isLoading}
                                                className="bg-primary hover:bg-primary-orange inline-flex cursor-pointer items-center rounded-md px-6 py-3 text-sm font-medium text-white transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {isLoading ? (
                                                    <motion.div
                                                        className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    />
                                                ) : null}
                                                {isLoading ? 'Loading...' : 'See All FAQs'}
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mx-auto max-w-[500px] basis-[30%]">
                            <FaqUserForm />
                        </div>
                    </div>
                </CommonBodyAnimation>

                <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Frequently Asked Questions">
                    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <FaqAccordion faqs={allFaqs.length > 0 ? allFaqs : faqs} />
                    </motion.div>
                </CustomModal>
            </div>
        </section>
    );
}
