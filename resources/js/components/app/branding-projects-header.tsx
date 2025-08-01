import SectionHeader from '@/components/app/section-header';

export default function BrandingProjectsHeader() {
    return (
        <div className="py-16">
            <div className="app-container">
                <SectionHeader
                    header={
                        <>
                            <span className="text-primary">The Walk of</span>
                            <br /> <span className="text-secondary-pink">Ideas</span>
                        </>
                    }
                    description="Explore our portfolio of successful projects. Each project showcases our creative process, strategic thinking, and the transformative impact of our solutions."
                    descriptionClass="!max-w-[900px] text-gray-600"
                />
            </div>
        </div>
    );
}
