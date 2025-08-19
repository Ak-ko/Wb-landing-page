import { Link } from '@inertiajs/react';
import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';
import WhyUsCard from './why-us-card';

const whyUsCards = [
    {
        img: '/assets/ele1.png',
        title: 'Client Focus',
        description: 'We treat each client as our only client. We think of our client’s business as our own.',
    },
    {
        img: '/assets/ele2.png',
        title: 'systematic creative process',
        description:
            'Operating with a highly organised and repeatable creative process, we ensure efficiency, consistency, and predictable excellence in every project.',
    },
    {
        img: '/assets/ele3.png',
        title: 'Healthy workplace',
        description: 'We go beyond just producing good design work but also focus on the happiness, satisfaction, and growth of our team members.',
    },
    {
        img: '/assets/ele4.png',
        title: 'transparent pricing',
        description: "All of our prices  can be easily accessed through our page. We won't charge you more just because you can afford it.",
    },
    {
        img: '/assets/ele5.png',
        title: 'humility',
        description: 'We will always be humble and speak your language; without any jargon or technobabble.',
    },
    {
        img: '/assets/ele6.png',
        title: 'accountability',
        description: 'We take pride in our work. We hold ourselves accountable for what we put out into the world.',
    },
];

export default function WhyUsSection() {
    return (
        <section className="about-sections py-32" id="about">
            <SectionHeader
                header="Why Us?"
                description={
                    <>
                        It has always been our reason for existence to help people achieve their goals
                        <br /> while doing what we love.
                    </>
                }
            />

            <CommonBodyAnimation>
                <div className="app-container py-11 2xl:!px-[200px]">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:gap-5">
                        {whyUsCards.map((card, index) => (
                            <WhyUsCard key={index} {...card} />
                        ))}
                    </div>
                </div>

                <div className="my-11 flex justify-center">
                    <Link href={route('about-us-page')} className="primary_btn">
                        See More About Us
                    </Link>
                </div>
            </CommonBodyAnimation>
        </section>
    );
}
