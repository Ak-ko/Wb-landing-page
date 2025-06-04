import SectionHeader from '@/components/app/section-header';

export default function BrandingProjectsHeader() {
    return (
        <div className="py-10">
            <div className="app-container">
                <SectionHeader
                    header={
                        <>
                            <span className="text-primary">Branding</span> <span className="text-secondary-pink">Projects</span>
                        </>
                    }
                    description="Explore our portfolio of successful branding projects. Each project showcases our creative process, strategic thinking, and the transformative impact of our branding solutions."
                    descriptionClass="!max-w-[900px] text-gray-600"
                />
            </div>
        </div>
    );
}
