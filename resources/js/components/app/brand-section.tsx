import { BrandT } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import SectionHeader from './section-header';

export default function BrandSection() {
    const { brands } = usePage<{ brands: BrandT[] }>().props;

    // Container animation only - simplified
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
                staggerChildren: 0.1,
            },
        },
    };

    // Simple fade-in for children with no hover effects
    const itemVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    // Function to determine grid column span based on index - only for larger screens
    const getGridClass = (index: number) => {
        // Create a repeating pattern regardless of how many items we have
        const position = index % 12; // Using 12 as our pattern length for more variety

        // First row: 5 columns (1-2-1-1)
        if (position === 0) return 'md:col-span-1';
        if (position === 1) return 'md:col-span-2';
        if (position === 2) return 'md:col-span-1';
        if (position === 3) return 'md:col-span-1';

        // Second row: 4 columns (2-1-1)
        if (position === 4) return 'md:col-span-2';
        if (position === 5) return 'md:col-span-1';
        if (position === 6) return 'md:col-span-1';

        // Third row: 3 columns (1-2)
        if (position === 7) return 'md:col-span-1';
        if (position === 8) return 'md:col-span-2';

        // Fourth row: 4 columns (1-1-2)
        if (position === 9) return 'md:col-span-1';
        if (position === 10) return 'md:col-span-1';
        if (position === 11) return 'md:col-span-2';

        return 'md:col-span-1';
    };

    // Function to determine if an item should be larger
    const getHeightClass = (index: number) => {
        // Make some items taller for visual interest - only on larger screens
        return index % 7 === 3 || index % 11 === 5 ? 'md:h-32 h-24' : 'h-24';
    };

    if (!brands || brands.length === 0) return null;

    return (
        <section className="about-sections py-32" id="brands">
            <SectionHeader
                header="Trusted by many"
                description="Since embarking on our journey, we've aided numerous brands in reaching their objectives and it has been a source of great pride for us."
            />

            <motion.div
                className="app-container mt-16 grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-5 md:gap-6 lg:gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {brands &&
                    brands?.map((brand: BrandT, index) => (
                        <motion.div
                            key={brand.id}
                            className={`col-span-1 ${getGridClass(index)} flex items-center justify-center rounded-lg bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-6`}
                            variants={itemVariants}
                        >
                            <div className={`flex ${getHeightClass(index)} w-full items-center justify-center transition-all duration-500`}>
                                <img
                                    src={brand.image}
                                    alt={brand.name}
                                    className="max-h-full max-w-full object-contain transition-all duration-300"
                                />
                            </div>
                        </motion.div>
                    ))}
            </motion.div>
        </section>
    );
}
