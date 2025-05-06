import AvailableWorksSection from '@/components/app/available-works-section';
import BrandSection from '@/components/app/brand-section';
import HeroSection from '@/components/app/hero-section';
import Navbar from '@/components/app/nav';
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
        </LandingLayout>
    );
}
