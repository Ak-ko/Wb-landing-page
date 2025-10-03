import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';

const BlogPageHeader = lazy(() => import('@/components/app/blog-page-header'));
const BlogPageSection = lazy(() => import('@/components/app/blog-page-section'));

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
        </LandingLayout>
    );
}
