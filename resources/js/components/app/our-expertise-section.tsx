import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { ExpertiseSectionT } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import CommonBodyAnimation from './common-body-animation';
import HighlightText from './highlight-text';
import CharacterRedWithSpring from './icons/characters/hero-section/character-red-with-spring';
import CharacterWithCoffee from './icons/characters/hero-section/character-with-coffee';
import SectionHeader from './section-header';

export default function OurExpertiseSection() {
    const { expertiseSections } = usePage<{ expertiseSections: ExpertiseSectionT[] }>().props;
    const { scrollTo } = useScroll();

    if (!expertiseSections?.length) {
        return null;
    }

    return (
        <section className="py-32">
            <div className="app-container overflow-hidden">
                <SectionHeader header="Our Expertise" />

                <CommonBodyAnimation>
                    <div className="3xl:px-[700px] grid grid-cols-1 gap-5 py-10 md:px-15 lg:grid-cols-2 xl:px-30 2xl:px-[200px]">
                        {expertiseSections.map((section) => {
                            const isBusinessType = section.type === 'business';
                            const sortedPlans = section.plans.sort((a, b) => a.order - b.order);

                            return (
                                <motion.div
                                    key={section.id}
                                    whileInView={{ x: 0 }}
                                    initial={{ x: isBusinessType ? -200 : 200 }}
                                    className="relative space-y-8 rounded-4xl bg-[#F5F5F5] p-9 shadow transition-all duration-500 hover:shadow-lg"
                                    style={
                                        {
                                            boxShadow: `0 10px 25px rgba(${parseInt(section.color.slice(1, 3), 16)}, ${parseInt(section.color.slice(3, 5), 16)}, ${parseInt(section.color.slice(5, 7), 16)}, 0.1)`,
                                            '--hover-shadow': `0 20px 40px rgba(${parseInt(section.color.slice(1, 3), 16)}, ${parseInt(section.color.slice(3, 5), 16)}, ${parseInt(section.color.slice(5, 7), 16)}, 0.3)`,
                                        } as React.CSSProperties & { '--hover-shadow': string }
                                    }
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = `0 20px 40px rgba(${parseInt(section.color.slice(1, 3), 16)}, ${parseInt(section.color.slice(3, 5), 16)}, ${parseInt(section.color.slice(5, 7), 16)}, 0.3)`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = `0 10px 25px rgba(${parseInt(section.color.slice(1, 3), 16)}, ${parseInt(section.color.slice(3, 5), 16)}, ${parseInt(section.color.slice(5, 7), 16)}, 0.1)`;
                                    }}
                                >
                                    <h1 className={cn('text-center text-3xl font-bold', isBusinessType ? 'md:text-start' : 'md:text-end')}>
                                        {section.title.split(' ').map((word, wordIndex, words) => {
                                            const isLastTwoWords = wordIndex >= words.length - 2;
                                            return isLastTwoWords ? (
                                                <span key={wordIndex} style={{ color: section.color }}>
                                                    {word}
                                                    {wordIndex < words.length - 1 ? ' ' : ''}
                                                </span>
                                            ) : (
                                                <span key={wordIndex}>
                                                    {word}
                                                    {wordIndex < words.length - 3 ? ' ' : ' '}
                                                    {wordIndex === words.length - 3 && <br />}
                                                </span>
                                            );
                                        })}
                                    </h1>

                                    <p
                                        className={cn(
                                            'text-center text-xl font-bold text-black/50',
                                            isBusinessType ? 'md:text-start' : 'md:text-end',
                                        )}
                                    >
                                        Pick this if you need..
                                    </p>

                                    <ul className={cn('list-none space-y-1', isBusinessType ? '' : 'text-end')}>
                                        {sortedPlans.map((plan, planIndex) => (
                                            <li
                                                key={planIndex}
                                                className={cn(
                                                    'flex items-start text-lg font-semibold uppercase',
                                                    isBusinessType ? '' : 'justify-end',
                                                )}
                                            >
                                                {isBusinessType ? (
                                                    <>
                                                        <Check className="mt-1 mr-2 h-4 w-4 stroke-2" style={{ color: section.color }} />
                                                        <span>{plan.text}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>{plan.text}</span>
                                                        <Check className="mt-1 ml-2 h-4 w-4 stroke-2" style={{ color: section.color }} />
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className={isBusinessType ? '' : 'md:text-end'}>
                                        <Link
                                            href={route(isBusinessType ? 'business-plan-page' : 'art-plan-page')}
                                            className={cn('primary_btn', 'flex justify-center px-8 py-5 transition-all duration-300 md:inline-flex')}
                                            style={
                                                {
                                                    backgroundColor: '#000000',
                                                    borderColor: '#000000',
                                                    color: '#ffffff',
                                                    '--hover-bg': section.color,
                                                    '--hover-border': section.color,
                                                } as React.CSSProperties & { '--hover-bg': string; '--hover-border': string }
                                            }
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = section.color;
                                                e.currentTarget.style.borderColor = section.color;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#000000';
                                                e.currentTarget.style.borderColor = '#000000';
                                            }}
                                        >
                                            See Packages
                                        </Link>
                                    </div>

                                    {isBusinessType ? (
                                        <div className="absolute -bottom-[45px] hidden md:right-[calc(100%-85%)] md:-bottom-[38px] md:block lg:right-[calc(100%-110%)] xl:right-[calc(100%-100%)]">
                                            <CharacterWithCoffee className="w-[200px] md:w-[220px]" viewBox="0 0 300 300" fill={section.color} />
                                        </div>
                                    ) : (
                                        <div className="absolute right-[calc(100%-65%)] -bottom-[61px] hidden md:block">
                                            <CharacterRedWithSpring className="w-[300px]" viewBox="0 0 300 300" />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
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
