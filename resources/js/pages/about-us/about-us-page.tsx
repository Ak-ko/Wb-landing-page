import AboutUsHeader from '@/components/app/about-us-header';
import AboutUsIntroSection from '@/components/app/about-us-intro-section';
import AboutWalkingBrandSection from '@/components/app/about-walking-brands-section';
import BlogSection from '@/components/app/blog-section';
import ContactUsSection from '@/components/app/contact-us-section';
import OurFoundingPurposeSection from '@/components/app/our-founding-purpose-section';
import OurPhilosophySection from '@/components/app/our-philosophy-section';
import TeamMembersSection from '@/components/app/team-members-section';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function AboutUsPage() {
    return (
        <LandingLayout>
            <Head title="About Us" />

            <AboutUsHeader />

            <AboutUsIntroSection />

            <AboutWalkingBrandSection />

            <OurFoundingPurposeSection />

            <OurPhilosophySection />

            <TeamMembersSection />

            <BlogSection />

            <ContactUsSection />
        </LandingLayout>
    );
}
