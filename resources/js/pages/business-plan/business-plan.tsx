import BusinessAddonOptions from '@/components/app/business-addon-options';
import BusinessPlanHeader from '@/components/app/business-plan-header';
import BusinessPlanSection from '@/components/app/business-plan-section';
import SeeArtServicesSection from '@/components/app/see-art-services';
import TermsAndConditionSection from '@/components/app/terms-and-condition-section';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function BusinessPlanPage() {
    return (
        <LandingLayout>
            <Head title="Business Plan" />

            <BusinessPlanHeader />

            <BusinessPlanSection />

            <BusinessAddonOptions />

            <SeeArtServicesSection />

            <TermsAndConditionSection />
        </LandingLayout>
    );
}
