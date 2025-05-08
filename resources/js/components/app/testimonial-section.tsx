import { scrollUpVarients } from '@/lib/animation-varients';
import { TestimonialT } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SectionHeader from './section-header';
import TestimonialCard from './testimonial-card';

export default function TestimonialSection() {
    const { testimonials } = usePage<{ testimonials: TestimonialT[] }>().props;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (testimonials?.length > 1) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials?.length]);

    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <section id="testimonials" className="app-container flex flex-col items-center py-28 lg:flex-row lg:items-start lg:justify-between">
            <SectionHeader
                containerClass="lg:block "
                headerClass="lg:text-start lg:max-w-sm"
                descriptionClass="lg:text-start !lg:max-w-[350px]"
                header="What our clients say"
                description="We aren't just a great creative studio, we're an excellent business partner."
            />
            <div className="relative w-full overflow-hidden py-20 lg:w-[550px] lg:py-0" style={{ height: '200px' }}>
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentIndex}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        variants={scrollUpVarients}
                        className="absolute top-0 left-0"
                    >
                        <TestimonialCard testimonial={testimonials[currentIndex]} containerClass="mb-3" />
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
