import { BrandingProjectT, TagT } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import BrandingProjectCard from './branding-project-card';
import SectionHeader from './section-header';
import TagBadge from './tag-badge';

export default function BrandingProjectSection() {
    const { brandingProjects, brandingProjectTags } = usePage<{ brandingProjects: BrandingProjectT[]; brandingProjectTags: TagT[] }>().props;

    if (!brandingProjects || brandingProjects.length === 0) {
        return null;
    }

    return (
        <section id="branding-projects" className="app-container py-20">
            <SectionHeader
                header="Brandings made with passion"
                description="We're committed to persisting in our mission of assisting countless more brands in the future — it's a promise we solemnly uphold."
                descriptionClass="sm:!max-w-[700px]"
            />

            {brandingProjectTags && brandingProjectTags?.length > 5 && (
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {brandingProjectTags.map((tag) => (
                        <TagBadge key={tag.id} tag={tag} tagCount={brandingProjectTags?.length as number} />
                    ))}
                </div>
            )}

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {brandingProjects.map((project) => (
                    <BrandingProjectCard key={project.id} project={project} />
                ))}
            </div>

            {brandingProjects.length > 0 && (
                <div className="mt-10 flex justify-center">
                    <Link href="/" className="primary_btn">
                        See More Works
                    </Link>
                </div>
            )}
        </section>
    );
}
