import { CompanyPolicyT } from '@/types';
import { usePage } from '@inertiajs/react';
import CommonBodyAnimation from './common-body-animation';
import PhilosophyBlueCharacter from './icons/characters/about-us-page/philosophy-section/blue-character';
import PhilosophyOrangeCharacter from './icons/characters/about-us-page/philosophy-section/orange-character';
import PhilosophyCard from './philosophy-card';
import SectionHeader from './section-header';

export default function OurPhilosophySection() {
    const { policy } = usePage<{ policy: CompanyPolicyT }>().props;

    const hasAnyPolicy = policy?.mission || policy?.vision || policy?.core_values;

    const availableCards = [policy?.mission && 'mission', policy?.vision && 'vision', policy?.core_values && 'core_values'].filter(Boolean);

    const cardCount = availableCards.length;

    return (
        hasAnyPolicy && (
            <section className="py-32">
                <div className="app-container">
                    <SectionHeader header="Our Philosophy" />

                    <CommonBodyAnimation>
                        {cardCount === 1 && (
                            <div className="flex justify-center py-11">
                                <div className="w-full max-w-2xl">
                                    {policy?.mission && (
                                        <PhilosophyCard
                                            title="Mission"
                                            containerClassName="h-full"
                                            titleClassName="text-secondary-orange"
                                            content={policy.mission}
                                        />
                                    )}
                                    {policy?.vision && (
                                        <PhilosophyCard
                                            containerClassName="h-full"
                                            title="Vision"
                                            titleClassName="text-crayola-blue"
                                            content={policy.vision}
                                        />
                                    )}
                                    {policy?.core_values && (
                                        <PhilosophyCard
                                            containerClassName="h-full"
                                            title="Core values"
                                            titleClassName="text-secondary-pink"
                                            content={policy.core_values}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {cardCount === 2 && (
                            <div className="grid grid-cols-1 gap-6 py-11 lg:grid-cols-2">
                                {policy?.mission && (
                                    <PhilosophyCard
                                        title="Mission"
                                        containerClassName="h-full"
                                        titleClassName="text-secondary-orange"
                                        content={policy.mission}
                                    />
                                )}
                                {policy?.vision && (
                                    <PhilosophyCard
                                        containerClassName="h-full"
                                        title="Vision"
                                        titleClassName="text-crayola-blue"
                                        content={policy.vision}
                                    />
                                )}
                                {policy?.core_values && (
                                    <PhilosophyCard
                                        containerClassName="h-full"
                                        title="Core values"
                                        titleClassName="text-secondary-pink"
                                        content={policy.core_values}
                                    />
                                )}
                            </div>
                        )}

                        {cardCount === 3 && (
                            <div className="flex flex-col items-center gap-3 py-11 lg:flex-row lg:items-stretch">
                                <div className="flex flex-col gap-3 lg:basis-[40%]">
                                    {policy?.mission && (
                                        <div className="h-full">
                                            <PhilosophyCard
                                                title="Mission"
                                                containerClassName="h-full"
                                                titleClassName="text-secondary-orange"
                                                content={policy.mission}
                                            />
                                        </div>
                                    )}

                                    {policy?.vision && (
                                        <div className="h-full">
                                            <PhilosophyCard
                                                containerClassName="h-full"
                                                title="Vision"
                                                titleClassName="text-crayola-blue"
                                                content={policy.vision}
                                            />
                                        </div>
                                    )}

                                    <div className="h-full">
                                        <div className="flex flex-col items-center lg:flex-row lg:items-start">
                                            <PhilosophyOrangeCharacter />
                                            <PhilosophyBlueCharacter className="translate-y-[calc(100%-230px)]" />
                                        </div>
                                    </div>
                                </div>

                                {policy?.core_values && (
                                    <div className="lg:basis-[60%]">
                                        <PhilosophyCard
                                            containerClassName="h-full"
                                            title="Core values"
                                            titleClassName="text-secondary-pink"
                                            content={policy.core_values}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </CommonBodyAnimation>
                </div>
            </section>
        )
    );
}
