import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';

const AboutUsIntroSection = lazy(() => import('@/components/app/about-us-intro-section'));
const AboutWalkingBrandSection = lazy(() => import('@/components/app/about-walking-brands-section'));
const BlogSection = lazy(() => import('@/components/app/blog-section'));
const ContactUsSection = lazy(() => import('@/components/app/contact-us-section'));
const OurPhilosophySection = lazy(() => import('@/components/app/our-philosophy-section'));
const TeamMembersSection = lazy(() => import('@/components/app/team-members-section'));

export default function AboutUsPage() {
    return (
        <LandingLayout>
            <Head title="About Us" />

            <Suspense fallback={<div />}>
                <AboutWalkingBrandSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <AboutUsIntroSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <OurPhilosophySection />
            </Suspense>

            <Suspense fallback={<div />}>
                <TeamMembersSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <BlogSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <ContactUsSection />
            </Suspense>
        </LandingLayout>
    );
}
