import AvailableWorksSection from '@/components/app/available-works-section';
import BlogSection from '@/components/app/blog-section';
import BookACallSection from '@/components/app/book-a-call-section';
import BrandSection from '@/components/app/brand-section';
import BrandingProjectSection from '@/components/app/branding-project-section';
import BusinessProcessSection from '@/components/app/business-process-section';
import ContactUsSection from '@/components/app/contact-us-section';
import FaqSection from '@/components/app/faq-section';
import HarmonyOfTheDesignSection from '@/components/app/harmony-of-the-design-section';
import HeroSection from '@/components/app/hero-section';
import OurExpertiseSection from '@/components/app/our-expertise-section';
import TestimonialSection from '@/components/app/testimonial-section';
import WhyUsSection from '@/components/app/why-us-section';
import LandingLayout from '@/layouts/landing-layout';
import { ExpertiseSectionT } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface ProjectShowcase {
    id: number;
    content: string;
    image: string;
    is_featured: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export default function HomePage() {
    const { projectShowcases, expertiseSections } = usePage<{
        projectShowcases: ProjectShowcase[];
        expertiseSections: ExpertiseSectionT[];
    }>().props;
    return (
        <LandingLayout>
            <Head title="Home" />

            <HeroSection />

            <AvailableWorksSection />

            <WhyUsSection />

            <BrandSection />

            <TestimonialSection />

            <HarmonyOfTheDesignSection projectShowcases={projectShowcases} />

            <BusinessProcessSection />

            <BrandingProjectSection />

            <BlogSection />

            <OurExpertiseSection expertiseSections={expertiseSections} />

            <FaqSection />

            <BookACallSection />

            <ContactUsSection />
        </LandingLayout>
    );
}
