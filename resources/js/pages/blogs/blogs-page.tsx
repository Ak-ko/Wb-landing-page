import BlogPageHeader from '@/components/app/blog-page-header';
import BlogPageSection from '@/components/app/blog-page-section';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function BlogsPage() {
    return (
        <LandingLayout>
            <Head title="Blogs" />

            <BlogPageHeader />

            <BlogPageSection />
        </LandingLayout>
    );
}
