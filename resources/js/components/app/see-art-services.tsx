import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function SeeArtServicesSection() {
    return (
        <section className="relative mx-auto overflow-hidden py-[100px] lg:py-[259px]">
            <div className="app-container space-y-5 sm:px-11">
                <div className="relative z-1 w-full space-y-6 lg:max-w-[520px]">
                    <h1 className="text-center text-[35px] leading-[1.2] font-bold sm:text-[40px] lg:text-start">
                        Want to upgrade your <span className="text-crayola-blue">Brand</span>
                        <br /> with the
                        <span className="text-secondary-pink"> Power of Art?</span>
                    </h1>
                    <p className="text-center text-[16.5px] leading-[1.7] font-semibold lg:text-start">
                        Transform your brand with our artistic expertise,
                        <br /> creating captivating visual identities that leave a <br /> lasting impression.
                    </p>
                    <div className="text-center lg:text-start">
                        <Link href={route('art-plan-page')} className={cn('primary_btn', 'flex justify-center px-8 py-3 md:inline-flex')}>
                            See Art Services
                        </Link>
                    </div>
                </div>
            </div>
            <img
                src="/assets/red-dragon.png"
                className="absolute right-[0%] hidden max-w-[1500px] lg:top-[-10%] lg:block lg:w-[900px] xl:top-[-40%] xl:w-auto"
            />
        </section>
    );
}
