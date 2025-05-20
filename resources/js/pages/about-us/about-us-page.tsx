import AboutUsHeader from '@/components/app/about-us-header';
import AboutUsIntroSection from '@/components/app/about-us-intro-section';
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

            <AboutUsHeader />

            <AboutUsIntroSection />

            <OurPhilosophySection />

            <TeamMembersSection />

            <BlogSection />

            <ContactUsSection />
        </LandingLayout>
    );
}
