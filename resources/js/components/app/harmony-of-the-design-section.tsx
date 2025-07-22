import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';

const images = {
    one: { image: '/assets/hod-1.png' },
    two: { image: '/assets/hod-2.jpg' },
    three: { image: '/assets/hod-3.jpg' },
    four: { image: '/assets/hod-4.jpg' },
    five: { image: '/assets/hod-5.png' },
    six: { image: '/assets/hod-6.png' },
    seven: { image: '/assets/hod-7.jpg' },
    eight: { image: '/assets/hod-8.jpg' },
    nine: { image: '/assets/hod-9.jpg' },
    ten: { image: '/assets/hod-10.png' },
    eleven: { image: '/assets/hod-11.png' },
    twelve: { image: '/assets/hod-12.jpg' },
    thirteen: { image: '/assets/hod-13.jpg' },
    fourteen: { image: '/assets/hod-14.png' },
    fifteen: { image: '/assets/hod-15.png' },
    sixteen: { image: '/assets/hod-16.jpg' },
    seventeen: { image: '/assets/hod-17.png' },
};

export default function HarmonyOfTheDesignSection() {
    const [isCompactMode, setIsCompactMode] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const layoutVariants = {
        hidden: {
            opacity: 0,
            scale: 0.98,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
        exit: {
            opacity: 0,
            scale: 0.98,
            transition: {
                duration: 0.4,
                ease: [0.55, 0.055, 0.675, 0.19],
            },
        },
    };

    const toggleMode = () => {
        setIsTransitioning(true);
        const newMode = !isCompactMode;
        setIsCompactMode(newMode);

        if (newMode) {
            setTimeout(() => {
                if (sectionRef.current) {
                    sectionRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
                setIsTransitioning(false);
            }, 600);
        } else {
            setTimeout(() => {
                setIsTransitioning(false);
            }, 600);
        }
    };

    const CompactLayout = () => (
        <div className="grid [grid-auto-rows:300px] grid-cols-1 gap-3 lg:[grid-auto-rows:300px] lg:[grid-template-columns:repeat(4,_280px)] 2xl:lg:[grid-template-columns:repeat(4,_300px)]">
            <div className="col-span-2">
                <img src={images.one.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 flex w-full items-center">
                <h1 className="mx-auto max-w-[300px] text-[50px] font-bold uppercase md:text-[75px]">Design</h1>
            </div>
            <div className="col-span-2 flex w-full items-center">
                <h1 className="mx-auto max-w-[300px] text-[50px] font-bold uppercase md:text-[75px]">Meets</h1>
            </div>
            <div>
                <img src={images.nine.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div>
                <img src={images.ten.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div>
                <img src={images.eleven.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div>
                <img src={images.twelve.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 flex w-full items-center">
                <h1 className="mx-auto max-w-[300px] text-[50px] font-bold uppercase md:text-[75px]">Art</h1>
            </div>
        </div>
    );

    const FullLayout = () => (
        <div className="grid [grid-auto-rows:300px] grid-cols-1 gap-3 lg:[grid-auto-rows:300px] lg:[grid-template-columns:repeat(4,_280px)] 2xl:lg:[grid-template-columns:repeat(4,_300px)]">
            <div className="col-span-2 lg:col-span-1">
                <img src={images.one.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 lg:col-span-1">
                <img src={images.two.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2">
                <img src={images.three.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2">
                <img src={images.four.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 flex w-full items-center">
                <p className="text-center text-xl font-light lg:ml-9 lg:max-w-[420px] lg:text-left">
                    Design is more than just aesthetics; it's about problem-solving and communicating ideas effectively.
                </p>
            </div>
            <div className="col-span-2 flex w-full items-center">
                <p className="ml-auto text-center text-xl font-light lg:mr-9 lg:max-w-[420px] lg:text-right">
                    Art, on the other hand, is about expression, creativity, and evoking emotions.
                </p>
            </div>
            <div className="col-span-2 lg:col-span-1">
                <img src={images.five.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 lg:col-span-1">
                <img src={images.seven.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2">
                <img src={images.eight.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 flex w-full items-center">
                <h1 className="mx-auto max-w-[300px] text-[50px] font-bold uppercase md:text-[75px]">Design</h1>
            </div>
            <div className="col-span-2 flex w-full items-center">
                <h1 className="mx-auto max-w-[300px] text-[50px] font-bold uppercase md:text-[75px]">Meets</h1>
            </div>
            <div className="col-span-2 lg:col-span-1">
                <img src={images.nine.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 lg:col-span-1">
                <img src={images.ten.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 lg:col-span-1">
                <img src={images.eleven.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 lg:col-span-1">
                <img src={images.twelve.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 flex w-full items-center">
                <h1 className="mx-auto max-w-[300px] text-[50px] font-bold uppercase md:text-[75px]">Art</h1>
            </div>
            <div className="col-span-2 flex w-full items-center">
                <p className="ml-auto text-center text-xl font-light lg:mr-9 lg:max-w-[420px] lg:text-right">
                    When these two elements come together, they form a powerful tool that can transform businesses and inspire people
                </p>
            </div>
            <div className="col-span-2">
                <img src={images.thirteen.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2">
                <img src={images.fourteen.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 flex w-full items-center">
                <p className="text-center text-xl font-light lg:ml-9 lg:max-w-[420px] lg:text-left">
                    Every brand has a story to tell, and through our artistic vision and design prowess, we help bring those stories to life.
                </p>
            </div>
            <div className="col-span-2 lg:col-span-1">
                <img src={images.fifteen.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2 lg:col-span-1">
                <img src={images.sixteen.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="col-span-2">
                <img src={images.seventeen.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
            </div>
        </div>
    );

    return (
        <section ref={sectionRef} id="harmony-of-the-designs-section" className="py-32">
            <SectionHeader
                header="The Harmony of Design and Art"
                description="At Walking Brands, we believe that design and art are two sides of the same coin. The fusion of these two disciplines allows us to create visually stunning and meaningful brand identities that resonate deeply with our clients and their audiences."
                descriptionClass="sm:!max-w-[800px]"
            />

            <CommonBodyAnimation>
                <div className="app-container flex justify-center py-15">
                    <div className="w-full">
                        <div className="space-y-8">
                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    {isCompactMode ? (
                                        <motion.div key="compact" variants={layoutVariants} initial="hidden" animate="visible" exit="exit">
                                            <CompactLayout />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="full" variants={layoutVariants} initial="hidden" animate="visible" exit="exit">
                                            <FullLayout />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex justify-center">
                                <motion.button
                                    onClick={toggleMode}
                                    disabled={isTransitioning}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`primary_btn ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    {isTransitioning ? 'Loading...' : isCompactMode ? 'Full Mood' : 'Compact Mood'}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </CommonBodyAnimation>
        </section>
    );
}
