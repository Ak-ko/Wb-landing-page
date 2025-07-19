import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';

const images = {
    one: {
        image: '/assets/hod-1.png',
    },
    two: {
        image: '/assets/hod-2.jpg',
    },
    three: {
        image: '/assets/hod-3.jpg',
    },
    four: {
        image: '/assets/hod-4.jpg',
    },
    five: {
        image: '/assets/hod-5.png',
    },
    six: {
        image: '/assets/hod-6.png',
    },
    seven: {
        image: '/assets/hod-7.jpg',
    },
    eight: {
        image: '/assets/hod-8.jpg',
    },
    nine: {
        image: '/assets/hod-9.jpg',
    },
    ten: {
        image: '/assets/hod-10.png',
    },
    eleven: {
        image: '/assets/hod-11.png',
    },
    twelve: {
        image: '/assets/hod-12.jpg',
    },
    thirteen: {
        image: '/assets/hod-13.jpg',
    },
    fourteen: {
        image: '/assets/hod-14.png',
    },
    fifteen: {
        image: '/assets/hod-15.png',
    },
    sixteen: {
        image: '/assets/hod-16.jpg',
    },
    seventeen: {
        image: '/assets/hod-17.png',
    },
};

export default function HarmonyOfTheDesignSection() {
    return (
        <section id="harmony-of-the-designs-section" className="py-32">
            <SectionHeader
                header="The Harmony of Design and Art"
                description="At Walking Brands, we believe that design and art are two sides of the same coin. The fusion of these two disciplines allows us to create visually stunning and meaningful brand identities that resonate deeply with our clients and their audiences."
                descriptionClass="sm:!max-w-[800px]"
            />

            <CommonBodyAnimation>
                <div className="app-container flex justify-center py-15">
                    <div className="grid [grid-auto-rows:280px] gap-3 lg:[grid-template-columns:repeat(4,_280px)] 2xl:lg:[grid-template-columns:repeat(4,_300px)]">
                        <div>
                            <img src={images.one.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div>
                            <img src={images.two.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div className="lg:col-span-2">
                            <img src={images.three.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div className="lg:col-span-2">
                            <img src={images.four.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div className="flex w-full items-center lg:col-span-2">
                            <p className="ml-9 text-center text-xl font-semibold lg:max-w-[420px] lg:text-left">
                                Design is more than just aesthetics; it's about problem-solving and communicating ideas effectively.
                            </p>
                        </div>
                        <div className="flex w-full items-center lg:col-span-2">
                            <p className="mr-9 ml-auto text-center text-xl font-semibold lg:max-w-[420px] lg:text-right">
                                Art, on the other hand, is about expression, creativity, and evoking emotions.
                            </p>
                        </div>
                        <div>
                            <img src={images.five.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div>
                            <img src={images.seven.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div className="lg:col-span-2">
                            <img src={images.eight.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div className="hidden w-full items-center lg:col-span-2 lg:flex">
                            <h1 className="mx-auto max-w-[300px] text-[50px] font-bold uppercase md:text-[75px]">Design</h1>
                        </div>
                        <div className="flex w-full flex-col items-center gap-5 py-5 lg:col-span-2 lg:hidden lg:flex-row lg:gap-0">
                            <h1 className="mx-auto max-w-[300px] text-[45px] font-bold uppercase md:text-[75px]">Design</h1>
                            <h1 className="mx-auto max-w-[300px] text-[45px] font-bold uppercase md:text-[75px]">Meets</h1>
                            <h1 className="mx-auto max-w-[300px] text-[45px] font-bold uppercase md:text-[75px]">Art</h1>
                        </div>
                        <div className="hidden w-full items-center lg:col-span-2 lg:flex">
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
                        <div className="hidden w-full items-center lg:col-span-2 lg:flex">
                            <h1 className="mx-auto max-w-[300px] text-[50px] font-bold uppercase md:text-[75px]">Art</h1>
                        </div>
                        <div className="flex w-full items-center lg:col-span-2">
                            <p className="mr-9 ml-auto text-center text-xl font-semibold lg:max-w-[420px] lg:text-right">
                                When these two elements come together, they form a powerful tool that can transform businesses and inspire people
                            </p>
                        </div>
                        <div className="lg:col-span-2">
                            <img src={images.thirteen.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div className="lg:col-span-2">
                            <img src={images.fourteen.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div className="flex w-full items-center lg:col-span-2">
                            <p className="ml-9 text-center text-xl font-semibold lg:max-w-[420px] lg:text-left">
                                Every brand has a story to tell, and through our artistic vision and design prowess, we help bring those stories to
                                life.
                            </p>
                        </div>
                        <div>
                            <img src={images.fifteen.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div>
                            <img src={images.sixteen.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                        <div className="lg:col-span-2">
                            <img src={images.seventeen.image} alt="Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                    </div>
                </div>
            </CommonBodyAnimation>
        </section>
    );
}
