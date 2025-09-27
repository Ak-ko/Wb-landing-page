import { BrandingProjectT, TagT } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import BrandingProjectCard from './branding-project-card';
import CommonBodyAnimation from './common-body-animation';
import ProjectTag from './project-tag';
import SectionHeader from './section-header';

export default function BrandingProjectSection() {
    const { brandingProjects, brandingProjectTags } = usePage<{ brandingProjects: BrandingProjectT[]; brandingProjectTags: TagT[] }>().props;

    if (!brandingProjects || brandingProjects.length === 0) {
        return null;
    }

    const displayTags = brandingProjectTags?.slice(0, 3) || [];
    const hasMoreTags = (brandingProjectTags?.length || 0) > 3;

    return (
        <section id="branding-projects" className="app-container py-32">
            <SectionHeader
                header="Brandings made with passion"
                description="We're committed to persisting in our mission of assisting countless more brands in the future. It's a promise we solemnly uphold."
                descriptionClass="sm:!max-w-[700px]"
            />

            <CommonBodyAnimation>
                {brandingProjectTags && brandingProjectTags.length > 0 && (
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                        {displayTags.map((tag) => (
                            <ProjectTag key={tag.id} tag={tag} tagCount={brandingProjectTags.length} showAnimation={false} />
                        ))}
                        {hasMoreTags && (
                            <Link
                                href={route('branding-projects.list')}
                                className="inline-flex items-center justify-center rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-colors duration-200 hover:bg-gray-300"
                            >
                                +More
                            </Link>
                        )}
                    </div>
                )}

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {brandingProjects.map((project) => (
                        <BrandingProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {brandingProjects.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <Link href={route('branding-projects.list')} className="primary_btn">
                            See More Works
                        </Link>
                    </div>
                )}
            </CommonBodyAnimation>
        </section>
    );
}
