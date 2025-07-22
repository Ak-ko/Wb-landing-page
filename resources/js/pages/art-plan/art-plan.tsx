import AnimationAndArtSection from '@/components/app/animation-and-art-section';
import ArtPlanHeader from '@/components/app/art-plan-header';
import ComicArtSection from '@/components/app/comic-art-section';
import IllustrationArtSection from '@/components/app/illustration-art-section';
import MascotArtSection from '@/components/app/mascot-art-section';
import SeeBusinessPlanServicesSection from '@/components/app/see-business-plan-services';
import StickerArtSection from '@/components/app/sticker-art-section';
import TermsAndConditionSection from '@/components/app/terms-and-condition-section';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function ArtPlanPage() {
    return (
        <LandingLayout>
            <Head title="Art Plan" />

            <ArtPlanHeader />

            <MascotArtSection />

            <IllustrationArtSection />

            <ComicArtSection />

            <AnimationAndArtSection />

            <StickerArtSection />

            <SeeBusinessPlanServicesSection />

            <TermsAndConditionSection />
        </LandingLayout>
    );
}
