import AboutUsIntroSection from '@/components/app/about-us-intro-section';
import AboutWalkingBrandSection from '@/components/app/about-walking-brands-section';
import BlogSection from '@/components/app/blog-section';
import ContactUsSection from '@/components/app/contact-us-section';
import OurPhilosophySection from '@/components/app/our-philosophy-section';
import TeamMembersSection from '@/components/app/team-members-section';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function AboutUsPage() {
    return (
        <LandingLayout>
            <Head title="About Us" />

            <AboutWalkingBrandSection />

            <AboutUsIntroSection />

            <OurPhilosophySection />

            <TeamMembersSection />

            <BlogSection />

            <ContactUsSection />
        </LandingLayout>
    );
}
