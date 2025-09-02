import { motion } from 'framer-motion';

import { CompanyPolicyT } from '@/types';
import { usePage } from '@inertiajs/react';
import CharacterWithTiltRightStyle from './icons/characters/navbar-section/character-with-titlt-right-style';
import PhilosophyCard from './philosophy-card';

export default function TermsAndConditionSection() {
    const page = usePage();

    const { policy } = page.props as unknown as { policy: CompanyPolicyT };

    if (!policy?.terms_and_conditions || !policy?.terms_and_conditions_for_art_services) return null;

    return (
        <section className="py-16">
            <div className="app-container space-y-5 sm:px-11">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.95, type: 'ease-in' }}
                    className="relative mx-auto max-w-[900px]"
                >
                    <PhilosophyCard
                        title="Terms & Conditions"
                        content={page?.url?.includes('art') ? policy?.terms_and_conditions_for_art_services : policy?.terms_and_conditions}
                    />
                    <CharacterWithTiltRightStyle
                        className="absolute -right-8 bottom-[-15%] hidden rotate-y-[180deg] md:block"
                        fill="var(--secondary-orange)"
                    />
                </motion.div>
            </div>
        </section>
    );
}
