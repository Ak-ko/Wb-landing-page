import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';

const AvailableWorksSection = lazy(() => import('@/components/app/available-works-section'));
const BlogSection = lazy(() => import('@/components/app/blog-section'));
const BookACallSection = lazy(() => import('@/components/app/book-a-call-section'));
const BrandSection = lazy(() => import('@/components/app/brand-section'));
const BrandingProjectSection = lazy(() => import('@/components/app/branding-project-section'));
const BusinessProcessSection = lazy(() => import('@/components/app/business-process-section'));
const ContactUsSection = lazy(() => import('@/components/app/contact-us-section'));
const FaqSection = lazy(() => import('@/components/app/faq-section'));
const HarmonyOfTheDesignSection = lazy(() => import('@/components/app/harmony-of-the-design-section'));
const HeroSection = lazy(() => import('@/components/app/hero-section'));
const OurExpertiseSection = lazy(() => import('@/components/app/our-expertise-section'));
const TestimonialSection = lazy(() => import('@/components/app/testimonial-section'));
const WhyUsSection = lazy(() => import('@/components/app/why-us-section'));

export default function HomePage() {
    return (
        <LandingLayout>
            <Head title="Home" />

            <Suspense fallback={<div />}>
                <HeroSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <AvailableWorksSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <WhyUsSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <BrandSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <TestimonialSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <HarmonyOfTheDesignSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <BusinessProcessSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <BrandingProjectSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <BlogSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <OurExpertiseSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <FaqSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <BookACallSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <ContactUsSection />
            </Suspense>
        </LandingLayout>
    );
}
