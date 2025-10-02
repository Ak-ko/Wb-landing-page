import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function SeeBusinessPlanServicesSection() {
    return (
        <section className="app-container relative mx-auto flex items-center overflow-hidden py-[100px] lg:py-[259px]">
            <img src="/assets/running-3d-mascot.png" className="max-w-[500px] -rotate-y-[180deg]" />
            <div className="app-container 3xl:pr-[400px] flex justify-end space-y-5 sm:px-11">
                <div className="relative z-1 w-full space-y-6 lg:max-w-[520px]">
                    <h1 className="text-center text-[35px] leading-[1.2] font-bold sm:text-[40px] lg:text-right">
                        Want to upgrade your <span className="text-crayola-blue">Brand</span>
                        <br /> with the
                        <span className="text-secondary-pink"> Power of Design?</span>
                    </h1>
                    <p className="text-center text-[16.5px] leading-[1.7] font-semibold lg:text-right">
                        Empower your brand with our artistic expertise,
                        <br /> creating captivating visual identities that leave a <br /> lasting impression.
                    </p>
                    <div className="text-center lg:text-right">
                        <Link href={route('business-plan-page')} className={cn('primary_btn', 'flex justify-center px-8 py-3 md:inline-flex')}>
                            See Design Services
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
