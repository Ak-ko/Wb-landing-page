import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';

const AnimationAndArtSection = lazy(() => import('@/components/app/animation-and-art-section'));
const ArtPlanHeader = lazy(() => import('@/components/app/art-plan-header'));
const ComicArtSection = lazy(() => import('@/components/app/comic-art-section'));
const IllustrationArtSection = lazy(() => import('@/components/app/illustration-art-section'));
const MascotArtSection = lazy(() => import('@/components/app/mascot-art-section'));
const SeeBusinessPlanServicesSection = lazy(() => import('@/components/app/see-business-plan-services'));
const StickerArtSection = lazy(() => import('@/components/app/sticker-art-section'));
const TermsAndConditionSection = lazy(() => import('@/components/app/terms-and-condition-section'));

export default function ArtPlanPage() {
    return (
        <LandingLayout>
            <Head title="Art Plan" />

            <Suspense fallback={<div />}>
                <ArtPlanHeader />
            </Suspense>

            <Suspense fallback={<div />}>
                <MascotArtSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <IllustrationArtSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <ComicArtSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <AnimationAndArtSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <StickerArtSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <SeeBusinessPlanServicesSection />
            </Suspense>

            <Suspense fallback={<div />}>
                <TermsAndConditionSection />
            </Suspense>
        </LandingLayout>
    );
}
