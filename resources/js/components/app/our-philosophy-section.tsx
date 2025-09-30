import { CompanyPolicyT } from '@/types';
import { usePage } from '@inertiajs/react';
import CommonBodyAnimation from './common-body-animation';
import PhilosophyCard from './philosophy-card';
import SectionHeader from './section-header';

export default function OurPhilosophySection() {
    const { policy } = usePage<{ policy: CompanyPolicyT }>().props;

    const hasAnyPolicy = policy?.mission || policy?.vision || policy?.core_values;

    return (
        hasAnyPolicy && (
            <section className="py-32">
                <div className="app-container">
                    <SectionHeader
                        header={
                            <>
                                Our <span className="text-crayola-blue">Philosophy</span>
                            </>
                        }
                    />

                    <CommonBodyAnimation>
                        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 py-11">
                            {policy?.mission && (
                                <div className="h-full w-full">
                                    <PhilosophyCard
                                        title="Mission"
                                        containerClassName="h-full"
                                        titleClassName="text-secondary-orange"
                                        content={policy.mission}
                                    />
                                </div>
                            )}

                            {policy?.vision && (
                                <div className="h-full w-full">
                                    <PhilosophyCard
                                        containerClassName="h-full"
                                        title="Vision"
                                        titleClassName="text-crayola-blue"
                                        content={policy.vision}
                                    />
                                </div>
                            )}

                            {policy?.core_values && (
                                <div className="h-full w-full">
                                    <PhilosophyCard
                                        containerClassName="h-full"
                                        title="Core values"
                                        titleClassName="text-secondary-pink"
                                        content={policy.core_values}
                                    />
                                </div>
                            )}
                        </div>
                    </CommonBodyAnimation>
                </div>
            </section>
        )
    );
}
