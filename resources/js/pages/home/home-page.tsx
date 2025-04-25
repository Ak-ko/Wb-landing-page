import AvailableWorksSection from '@/components/app/available-works-section';
import HeroSection from '@/components/app/hero-section';
import Navbar from '@/components/app/nav';
import WhyUsSection from '@/components/app/why-us-section';
import { Head } from '@inertiajs/react';

export default function HomePage() {
    return (
        <>
            <Head title="Home" />

            <Navbar />

            <HeroSection />

            <AvailableWorksSection />

            <WhyUsSection />
        </>
    );
}
