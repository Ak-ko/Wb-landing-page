import ContactUsSection from '@/components/app/contact-us-section';
import SectionHeader from '@/components/app/section-header';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function ContactUsPage() {
    return (
        <LandingLayout>
            <Head title="Contact Us" />
            <div className="app-container py-12">
                <SectionHeader
                    header={
                        <>
                            Say <span className="text-chillie-red">Hello</span>
                        </>
                    }
                    description="We would love to hear from you! Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions. Reach out and let's start a conversation."
                    descriptionClass="!max-w-[900px] text-gray-600"
                />
                <ContactUsSection />
            </div>
        </LandingLayout>
    );
}
