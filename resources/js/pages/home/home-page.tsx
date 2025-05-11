import AvailableWorksSection from '@/components/app/available-works-section';
import BrandSection from '@/components/app/brand-section';
import BrandingProjectSection from '@/components/app/branding-project-section';
import BusinessProcessSection from '@/components/app/business-process-section';
import HarmonyOfTheDesignSection from '@/components/app/harmony-of-the-design-section';
import HeroSection from '@/components/app/hero-section';
import Navbar from '@/components/app/nav';
import TestimonialSection from '@/components/app/testimonial-section';
import WhyUsSection from '@/components/app/why-us-section';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function HomePage() {
    return (
        <LandingLayout>
            <Head title="Home" />

            <Navbar />

            <HeroSection />

            <AvailableWorksSection />

            <WhyUsSection />

            <BrandSection />

            <TestimonialSection />

            <HarmonyOfTheDesignSection />

            <BusinessProcessSection />

            <BrandingProjectSection />
        </LandingLayout>
    );
}
