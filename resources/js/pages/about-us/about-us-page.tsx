import AboutUsHeader from '@/components/app/about-us-header';
import AboutUsIntroSection from '@/components/app/about-us-intro-section';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function AboutUsPage() {
    return (
        <LandingLayout>
            <Head title="About Us" />

            <AboutUsHeader />

            <AboutUsIntroSection />
        </LandingLayout>
    );
}
