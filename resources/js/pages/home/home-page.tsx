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
import TestimonialSection from '@/components/app/testimonial-section';
import WhyUsSection from '@/components/app/why-us-section';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function HomePage() {
    return (
        <LandingLayout>
            <Head title="Home" />

            <HeroSection />

            <AvailableWorksSection />

            <WhyUsSection />

            <BrandSection />

            <TestimonialSection />

            <HarmonyOfTheDesignSection />

            <BusinessProcessSection />

            <BrandingProjectSection />

            <BlogSection />

            <FaqSection />

            <BookACallSection />

            <ContactUsSection />
        </LandingLayout>
    );
}
