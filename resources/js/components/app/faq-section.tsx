import FaqAccordion from './faq-accordion';
import FaqUserForm from './faq-user-form';
import SectionHeader from './section-header';

import { FaqT } from '@/types';
import { usePage } from '@inertiajs/react';

export default function FaqSection() {
    const { faqs } = usePage<{ faqs: FaqT[] }>().props;
    return (
        <section className="py-16">
            <div className="app-container">
                <SectionHeader header="Commonly Asked Questions" containerClass="!justify-start !items-start" headerClass="!text-start" />

                <div className="flex flex-col lg:flex-row">
                    <div className="basis-[80%]">
                        {faqs.length > 0 && (
                            <div className="mt-8">
                                <FaqAccordion faqs={faqs} />
                            </div>
                        )}
                    </div>

                    <div className="mx-auto max-w-[500px] basis-[30%]">
                        <FaqUserForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
