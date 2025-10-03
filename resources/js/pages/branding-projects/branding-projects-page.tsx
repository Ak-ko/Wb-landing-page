import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';

const BrandingProjectsHeader = lazy(() => import('../../components/app/branding-projects-header'));
const BrandingProjectsSection = lazy(() => import('../../components/app/branding-projects-section'));

export default function BrandingProjectsPage() {
    return (
        <LandingLayout>
            <Head title="Branding Projects" />
            <Suspense fallback={<div />}>
                <BrandingProjectsHeader />
            </Suspense>
            <Suspense fallback={<div />}>
                <BrandingProjectsSection />
            </Suspense>
        </LandingLayout>
    );
}
