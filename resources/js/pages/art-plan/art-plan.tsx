import ArtPlanHeader from '@/components/app/art-plan-header';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function ArtPlanPage() {
    return (
        <LandingLayout>
            <Head title="Art Plan" />

            <ArtPlanHeader />
        </LandingLayout>
    );
}
