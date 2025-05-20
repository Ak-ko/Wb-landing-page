import { CompanyPolicyT } from '@/types';
import { usePage } from '@inertiajs/react';
import PhilosophyCard from './philosophy-card';
import SectionHeader from './section-header';

export default function OurPhilosophySection() {
    const { policy } = usePage<{ policy: CompanyPolicyT }>().props;

    return (
        <section className="py-16">
            <div className="app-container">
                <SectionHeader header="Our Philosophy" />

                <div className="flex gap-3 py-11">
                    <div className="flex basis-[40%] flex-col gap-3">
                        <div className="h-full">
                            <PhilosophyCard
                                title="Mission"
                                containerClassName="h-full"
                                titleClassName="text-secondary-orange"
                                content={policy?.mission}
                            />
                        </div>

                        <div className="h-full">
                            <PhilosophyCard containerClassName="h-full" title="Vision" titleClassName="text-crayola-blue" content={policy?.vision} />
                        </div>
                    </div>

                    <div className="basis-[60%]">
                        <PhilosophyCard title="Core values" titleClassName="text-secondary-pink" content={policy?.core_values} />
                    </div>
                </div>
            </div>
        </section>
    );
}
