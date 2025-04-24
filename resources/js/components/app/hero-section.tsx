import ActivePing from './active-ping';
import GlassesIcon from './icons/glasses';

export default function HeroSection() {
    return (
        <div className="py-16">
            <div className="flex flex-col items-center">
                <GlassesIcon className="mb-3 block" width={60} />
                <h1 className="hero-section-header-text-size max-w-[360px] text-center font-extrabold uppercase sm:max-w-4xl sm:font-bold">
                    creating brands <span className="text-secondary-pink">You can be proud of</span>
                </h1>
                <p className="mt-3 max-w-[300px] text-center text-xl font-semibold tracking-wide uppercase sm:max-w-full">
                    a branding agency with a vision
                </p>

                <div className="my-5 flex items-center gap-1.5">
                    <ActivePing />
                    <span className="text-sm sm:text-lg">Available Now</span>
                </div>
            </div>

            {/* 2 mascot */}
            {/* <div>
                    <div>mascot 1</div>
                    <div>mascot 2</div>
                </div> */}
        </div>
    );
}
