import { CompanyPolicyT } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

import CharacterWithTiltRightStyle from './icons/characters/navbar-section/character-with-titlt-right-style';
import PhilosophyCard from './philosophy-card';

export default function TermsAndConditionSection() {
    const { policy } = usePage<{ policy: CompanyPolicyT }>().props;

    if (!policy?.terms_and_conditions) return null;

    return (
        <section className="py-16">
            <div className="app-container space-y-5 sm:px-11">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.95, type: 'ease-in' }}
                    className="relative mx-auto max-w-[900px]"
                >
                    <PhilosophyCard title="Terms & Conditions" content={policy?.terms_and_conditions} />
                    <CharacterWithTiltRightStyle
                        className="absolute -right-8 bottom-[-15%] hidden rotate-y-[180deg] md:block"
                        fill="var(--secondary-orange)"
                    />
                </motion.div>
            </div>
        </section>
    );
}
