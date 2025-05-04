import ActivePing from './active-ping';
import HeroSectionBtn from './hero-section-btn';
import CharacterRedWithSpring from './icons/characters/hero-section/character-red-with-spring';
import CharacterWithCoffee from './icons/characters/hero-section/character-with-coffee';
import GlassesIcon from './icons/glasses';

export default function HeroSection() {
    return (
        <div className="py-16">
            <div className="flex flex-col items-center">
                <GlassesIcon className="mb-3 block" width={60} />
                <h1 className="hero-section-header-text-size max-w-[360px] text-center font-extrabold uppercase sm:font-bold md:max-w-2xl xl:max-w-3xl">
                    creating brands <span className="text-secondary-pink">You can be proud of</span>
                </h1>
                <p className="mt-3 max-w-[300px] text-center text-xl font-semibold tracking-wide uppercase sm:max-w-full">
                    a branding agency with a vision
                </p>
            </div>

            <div className="relative flex flex-col items-center justify-center gap-5 pt-7 lg:flex-row">
                <div className="hidden w-full md:block">
                    <CharacterWithCoffee className="hero__left__mascot absolute w-[120px] md:bottom-0 md:left-[calc(100vw-86%)] lg:-bottom-8 xl:left-[calc(100vw-76%)] 2xl:left-[calc(100vw-65%)]" />
                </div>
                <HeroSectionBtn
                    className="hover:bg-crayola-blue hover:shadow-crayola-blue/50 active:bg-crayola-blue hover:shadow-lg"
                    initialChildren={
                        <>
                            Make It Work with the <br /> power of design
                        </>
                    }
                    hoverChildren={
                        <>
                            Explore Our <br />
                            Design Packages
                        </>
                    }
                    href="/"
                />
                <HeroSectionBtn
                    className="hover:bg-chillie-red active:bg-chillie-red hover:shadow-chillie-red/50 hover:shadow-lg"
                    initialChildren={
                        <>
                            make it shine with the <br />
                            power of art
                        </>
                    }
                    hoverChildren={
                        <>
                            Explore Our <br />
                            Art Packages
                        </>
                    }
                    href="/"
                />
                <div className="hidden w-full md:block">
                    <CharacterRedWithSpring className="hero__right__mascot absolute w-[170px] md:right-[calc(100vw-92%)] md:-bottom-5 lg:-bottom-13 xl:right-[calc(100vw-80%)] 2xl:right-[calc(100vw-67%)]" />
                </div>
            </div>

            <div className="my-8 flex items-center justify-center gap-1.5">
                <ActivePing />
                <span className="text-sm sm:text-lg">Available Now</span>
            </div>
        </div>
    );
}
