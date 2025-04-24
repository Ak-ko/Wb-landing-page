import HeroSection from '@/components/app/hero-section';
import Navbar from '@/components/app/nav';
import { Head } from '@inertiajs/react';

export default function HomePage() {
    return (
        <>
            <Head title="Home" />

            <Navbar />

            <HeroSection />
        </>
    );
}
