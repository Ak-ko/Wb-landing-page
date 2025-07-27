import { BrandingProjectT, TagT } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import BrandingProjectCard from './branding-project-card';
import CommonBodyAnimation from './common-body-animation';
import ProjectTag from './project-tag';
import SectionHeader from './section-header';

export default function BrandingProjectSection() {
    const { brandingProjects, brandingProjectTags } = usePage<{ brandingProjects: BrandingProjectT[]; brandingProjectTags: TagT[] }>().props;
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Preload all images from all projects
    useEffect(() => {
        if (!brandingProjects || brandingProjects.length === 0) {
            setImagesLoaded(true);
            return;
        }

        const allImages: string[] = [];
        brandingProjects.forEach((project) => {
            if (project.images && project.images.length > 0) {
                const sortedImages = [...project.images].sort((a, b) => {
                    if (a.is_primary) return -1;
                    if (b.is_primary) return 1;
                    return a.order - b.order;
                });
                sortedImages.forEach((image) => {
                    if (image.image) {
                        allImages.push(image.image);
                    }
                });
            }
        });

        if (allImages.length === 0) {
            setImagesLoaded(true);
            return;
        }

        let loadedCount = 0;
        const totalImages = allImages.length;

        const checkAllLoaded = () => {
            loadedCount++;
            if (loadedCount >= totalImages) {
                setImagesLoaded(true);
            }
        };

        allImages.forEach((imageSrc) => {
            const img = new Image();
            img.onload = checkAllLoaded;
            img.onerror = checkAllLoaded; // Count as loaded even if failed
            img.src = imageSrc;
        });
    }, [brandingProjects]);

    if (!brandingProjects || brandingProjects.length === 0) {
        return null;
    }

    // Server already provides tags with branding project relationships
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
                {/* Tags Section */}
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

                {/* Project Cards Section */}
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {!imagesLoaded
                        ? // Show skeleton loading
                          Array.from({ length: Math.min(brandingProjects.length, 6) }).map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
                        : // Show actual cards when images are loaded
                          brandingProjects.map((project) => <BrandingProjectCard key={project.id} project={project} />)}
                </div>

                {/* See More Works Button */}
                {brandingProjects.length > 0 && imagesLoaded && (
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

// Skeleton loading component
const SkeletonCard = () => (
    <div className="group relative animate-pulse overflow-hidden rounded-lg bg-gray-200 shadow-md">
        <div className="aspect-[4/3] w-full bg-gray-300"></div>
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-400"></div>
            <div className="mb-1 h-4 w-1/2 rounded bg-gray-400"></div>
            <div className="h-3 w-1/3 rounded bg-gray-400"></div>
        </div>
    </div>
);
