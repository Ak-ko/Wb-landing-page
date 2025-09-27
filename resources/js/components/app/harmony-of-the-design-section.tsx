import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';

interface ProjectShowcase {
    id: number;
    content: string;
    image: string;
    image_url: string;
    is_featured: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export default function HarmonyOfTheDesignSection() {
    const { projectShowcases } = usePage<{ projectShowcases: ProjectShowcase[] }>().props;
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    // If no showcases are provided, show a placeholder message
    if (projectShowcases.length === 0) {
        return (
            <section id="harmony-of-the-designs-section" className="py-32">
                <SectionHeader
                    header="Design Meets Art"
                    description="At Walking Brands, we believe that design and art are two sides of the same coin. The fusion of these two disciplines allows us to create visually stunning and meaningful brand identities that resonate deeply with our clients and their audiences."
                    descriptionClass="sm:!max-w-[800px]"
                />
                <CommonBodyAnimation>
                    <div className="app-container flex justify-center py-15">
                        <div className="w-full text-center">
                            <p className="text-gray-500">No project showcases available at the moment.</p>
                        </div>
                    </div>
                </CommonBodyAnimation>
            </section>
        );
    }

    return (
        <section id="harmony-of-the-designs-section" className="py-32">
            <SectionHeader
                header="Design Meets Art"
                description="At Walking Brands, we believe that design and art are two sides of the same coin. The fusion of these two disciplines allows us to create visually stunning and meaningful brand identities that resonate deeply with our clients and their audiences."
                descriptionClass="sm:!max-w-[800px]"
            />

            <CommonBodyAnimation>
                <div className="app-container py-15">
                    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
                        {projectShowcases.map((showcase, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div key={showcase.id} variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                                    {/* Image */}
                                    <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                                        <img
                                            src={showcase.image_url}
                                            alt={`Project Showcase ${showcase.id}`}
                                            className="h-[300px] w-full rounded-lg object-cover lg:h-[400px]"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className={`flex items-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                                        <div className={`w-full ${isEven ? 'lg:pl-8' : 'lg:pr-8'}`}>
                                            <p
                                                className={`text-xl leading-relaxed font-light ${
                                                    isEven ? 'text-left lg:text-left' : 'text-left lg:text-right'
                                                }`}
                                            >
                                                {showcase.content}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </CommonBodyAnimation>
        </section>
    );
}
