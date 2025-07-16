import { useState } from 'react';
import CustomModal from '../ui/custom-modal';
import CommonBodyAnimation from './common-body-animation';
import FaqAccordion from './faq-accordion';
import FaqUserForm from './faq-user-form';
import SectionHeader from './section-header';

import { FaqT } from '@/types';
import { usePage } from '@inertiajs/react';

const INITIAL_FAQ_COUNT = 6;

export default function FaqSection() {
    const { faqs } = usePage<{ faqs: FaqT[] }>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const hasMoreFaqs = faqs.length > INITIAL_FAQ_COUNT;

    const displayedFaqs = hasMoreFaqs ? faqs.slice(0, INITIAL_FAQ_COUNT) : faqs;

    return (
        <section id="faqSection" className="">
            <div className="app-container">
                <SectionHeader header="Commonly Asked Questions" containerClass="!justify-start !items-start" headerClass="!lg:text-start" />

                <CommonBodyAnimation>
                    <div className="flex flex-col lg:flex-row">
                        <div className="basis-[80%]">
                            {displayedFaqs.length > 0 && (
                                <div className="mt-8">
                                    <FaqAccordion faqs={displayedFaqs} />
                                    {hasMoreFaqs && (
                                        <div className="mt-6 text-center">
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="bg-primary hover:bg-primary-orange inline-flex cursor-pointer items-center rounded-md px-6 py-3 text-sm font-medium text-white transition-colors duration-500"
                                            >
                                                See All FAQs
                                            </button>
                                        </div>
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
                    <div className="space-y-4">
                        <FaqAccordion faqs={faqs} />
                    </div>
                </CustomModal>
            </div>
        </section>
    );
}
