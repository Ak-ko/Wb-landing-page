import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import CommonBodyAnimation from './common-body-animation';
import HighlightText from './highlight-text';
import CharacterRedWithSpring from './icons/characters/hero-section/character-red-with-spring';
import CharacterWithCoffee from './icons/characters/hero-section/character-with-coffee';
import SectionHeader from './section-header';

const businessPlans = [
    'Logo & Branding or rebranding',
    'Brand Strategy & Guidelines',
    'Illustration or Digital Art',
    'Mascot Design',
    'Comic Art',
    'One-time Requests',
];

const artPlans = ['Social media designs', 'UI / UX Designs', 'Unlimited Artworks', 'Unlimited requests', 'Unlimited Brands', 'Unlimited Users'];

export default function OurExpertiseSection() {
    const { scrollTo } = useScroll();

    return (
        <section className="py-32">
            <div className="app-container overflow-hidden">
                <SectionHeader header="Our Expertise" />

                <CommonBodyAnimation>
                    <div className="grid grid-cols-1 gap-5 py-10 md:px-15 lg:grid-cols-2 xl:px-30 2xl:px-[320px]">
                        {/* New Business Card */}
                        <motion.div
                            whileInView={{ x: 0 }}
                            initial={{ x: -200 }}
                            className="relative space-y-8 rounded-4xl bg-[#F5F5F5] p-9 shadow transition-all duration-500 hover:shadow-lg hover:shadow-[#1CB3CE50]"
                        >
                            <h1 className="text-center text-3xl font-bold md:text-start">
                                Setting up your <br />
                                <span className="text-crayola-blue">New Business?</span>
                            </h1>

                            <p className="text-center text-xl font-bold text-black/50 md:text-start">Pick this if you need..</p>

                            <ul className="list-none space-y-1">
                                {businessPlans.map((b, x) => (
                                    <li key={x} className="flex items-start text-lg font-semibold uppercase">
                                        <Check className="text-crayola-blue mt-1 mr-2 h-4 w-4 stroke-2" />
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>

                            <div>
                                <Link
                                    href={route('business-plan-page')}
                                    className={cn('primary_btn', 'flex justify-center px-8 py-5 hover:bg-[#1bb4cf] md:inline-flex')}
                                >
                                    See Packages
                                </Link>
                            </div>

                            <div className="absolute -bottom-[45px] hidden md:right-[calc(100%-85%)] md:-bottom-[38px] md:block lg:right-[calc(100%-110%)] xl:right-[calc(100%-100%)]">
                                <CharacterWithCoffee className="w-[200px] md:w-[220px]" viewBox="0 0 300 300" fill="#1CB3CE" />
                            </div>
                        </motion.div>

                        {/* Established Business Card */}
                        <motion.div
                            whileInView={{ x: 0 }}
                            initial={{ x: 200 }}
                            className="hover:shadow-chillie-red/20 relative space-y-8 rounded-4xl bg-[#F5F5F5] p-9 shadow transition-all duration-500 hover:shadow-lg"
                        >
                            <h1 className="text-center text-3xl font-bold md:text-end">
                                Expanding Your <br />
                                <span className="text-chillie-red">Established Business?</span>
                            </h1>

                            <p className="text-center text-xl font-bold text-black/50 md:text-end">Pick this if you need..</p>

                            <ul className="list-none space-y-1 text-end">
                                {artPlans.map((b, x) => (
                                    <li key={x} className="flex items-start justify-end text-lg font-semibold uppercase">
                                        <span>{b}</span>
                                        <Check className="text-chillie-red mt-1 ml-2 h-4 w-4 stroke-2" />
                                    </li>
                                ))}
                            </ul>

                            <div className="md:text-end">
                                <Link href={route('art-plan-page')} className={cn('primary_btn', 'flex justify-center px-8 py-5 md:inline-flex')}>
                                    See Packages
                                </Link>
                            </div>

                            <div className="absolute right-[calc(100%-70%)] -bottom-[61px] hidden md:block">
                                <CharacterRedWithSpring className="w-[300px]" viewBox="0 0 300 300" />
                            </div>
                        </motion.div>
                    </div>
                </CommonBodyAnimation>
                {/* HighlightText CTA */}
                <p className="my-32 text-center text-2xl font-semibold md:text-3xl">
                    <span className="mb-2 block">Still don't know what to pick?</span>
                    <HighlightText onClick={() => scrollTo('#faqSection')} content="Read our Commonly Asked Questions!" />
                </p>
            </div>
        </section>
    );
}
