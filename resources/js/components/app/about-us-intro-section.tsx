import { motion } from 'framer-motion';
import AboutUsIntroContent from './about-us-intro-content';
import OurFoundingPurposeSection from './our-founding-purpose-section';

export default function AboutUsIntroSection() {
    // Section container animation
    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.8,
            },
        },
    };

    // Individual content block animation
    const contentBlockVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    return (
        <motion.section className="py-32" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="app-container">
                <motion.div className="mb-32" variants={contentBlockVariants}>
                    <AboutUsIntroContent
                        titleClassName="text-center lg:text-start"
                        title={
                            <>
                                We Love <br /> What We Do
                            </>
                        }
                        description="They say if you love what you do, you'll never work a day in your life. At Walking Brands, our mission is clear: to help businesses
succeed by providing top-notch creative solutions, while doing what we love."
                        descriptionClassName="text-center lg:text-start mt-5"
                        image="/assets/about-us-1.jpg"
                        imageClassName="w-full lg:w-auto"
                    />
                </motion.div>

                <OurFoundingPurposeSection />

                <motion.div variants={contentBlockVariants}>
                    <AboutUsIntroContent
                        isReversed
                        title={
                            <>
                                Towards <br /> MUTUAL SUCCESS
                            </>
                        }
                        titleClassName="text-center lg:text-right"
                        description="We work towards mutual success by thinking of your business as our own. We will always treat you as if you were our only client. Together, we will turn your brand vision into a reality."
                        descriptionClassName="text-center lg:text-right mt-5"
                        image="/assets/about-us-2.jpg"
                    />
                </motion.div>
            </div>
        </motion.section>
    );
}
