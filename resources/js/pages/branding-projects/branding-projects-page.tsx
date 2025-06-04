import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import BrandingProjectsHeader from '../../components/app/branding-projects-header';
import BrandingProjectsSection from '../../components/app/branding-projects-section';

export default function BrandingProjectsPage() {
    return (
        <LandingLayout>
            <Head title="Branding Projects" />
            <BrandingProjectsHeader />
            <BrandingProjectsSection />
        </LandingLayout>
    );
}
