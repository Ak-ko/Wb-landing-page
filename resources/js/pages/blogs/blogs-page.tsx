import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';

const BlogPageHeader = lazy(() => import('@/components/app/blog-page-header'));
const BlogPageSection = lazy(() => import('@/components/app/blog-page-section'));
const ContactUsSection = lazy(() => import('@/components/app/contact-us-section'));

export default function BlogsPage() {
    return (
        <LandingLayout>
            <Head title="Blogs" />

            <Suspense fallback={<div />}>
                <BlogPageHeader />
            </Suspense>

            <Suspense fallback={<div />}>
                <BlogPageSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <ContactUsSection />
            </Suspense>
        </LandingLayout>
    );
}
