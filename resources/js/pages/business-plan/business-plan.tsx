import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';

const BusinessAddonOptions = lazy(() => import('@/components/app/business-addon-options'));
const BusinessPlanHeader = lazy(() => import('@/components/app/business-plan-header'));
const BusinessPlanSection = lazy(() => import('@/components/app/business-plan-section'));
const SeeArtServicesSection = lazy(() => import('@/components/app/see-art-services'));
const TermsAndConditionSection = lazy(() => import('@/components/app/terms-and-condition-section'));

export default function BusinessPlanPage() {
    return (
        <LandingLayout>
            <Head title="Business Plan" />

            <Suspense fallback={<div />}>
                <BusinessPlanHeader />
            </Suspense>

            <Suspense fallback={<div />}>
                <BusinessPlanSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <BusinessAddonOptions />
            </Suspense>

            <Suspense fallback={<div />}>
                <SeeArtServicesSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <TermsAndConditionSection />
            </Suspense>
        </LandingLayout>
    );
}
