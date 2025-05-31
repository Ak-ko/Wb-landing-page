import BusinessAddonOptions from '@/components/app/business-addon-options';
import BusinessPlanHeader from '@/components/app/business-plan-header';
import BusinessPlanSection from '@/components/app/business-plan-section';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function BusinessPlanPage() {
    return (
        <LandingLayout>
            <Head title="Home" />

            <BusinessPlanHeader />

            <BusinessPlanSection />

            <BusinessAddonOptions />
        </LandingLayout>
    );
}
