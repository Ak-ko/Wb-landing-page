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
            if (testimonials.length > 1) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    const variants = {
        enter: { y: 100, opacity: 0, zIndex: 1, position: 'absolute' },
        center: { y: 0, opacity: 1, zIndex: 2, position: 'relative' },
        exit: {
            y: 0,
            opacity: 0,
            zIndex: 0,
            position: 'absolute',
            transition: { duration: 0.2, delay: 0.5 },
        },
    };

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
            <div className="relative w-full overflow-hidden py-20 lg:w-auto lg:py-0" style={{ minHeight: '300px' }}>
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        // @ts-expect-error @ts-ignore
                        variants={variants}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                            duration: 0.5,
                        }}
                        className="absolute top-0 left-0 w-full"
                    >
                        <TestimonialCard testimonial={testimonials[currentIndex]} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
