import SectionHeader from './section-header';

export default function BlogPageHeader() {
    return (
        <div className="py-16">
            <div className="app-container">
                <SectionHeader
                    header={
                        <>
                            Studio <span className="text-crayola-blue">Journal</span>
                        </>
                    }
                    description="Explore our blog for the latest insights, practical tips, and creative inspiration on branding, design, and digital strategy. Stay updated with trends, behind-the-scenes stories, and ideas that help your business grow."
                    descriptionClass="!max-w-[900px]"
                />
            </div>
        </div>
    );
}
