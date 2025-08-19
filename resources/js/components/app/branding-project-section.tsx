/* eslint-disable react-hooks/exhaustive-deps */
import { getCachedImageSrc, useImageCache } from '@/hooks/use-image-cache';
import { BrandingProjectT, TagT } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import BrandingProjectCard from './branding-project-card';
import CommonBodyAnimation from './common-body-animation';
import ProjectTag from './project-tag';
import SectionHeader from './section-header';

export default function BrandingProjectSection() {
    const { brandingProjects, brandingProjectTags } = usePage<{ brandingProjects: BrandingProjectT[]; brandingProjectTags: TagT[] }>().props;

    const allImageUrls = useMemo(() => {
        if (!brandingProjects || brandingProjects.length === 0) {
            return [];
        }

        const imageUrls: string[] = [];
        brandingProjects.forEach((project) => {
            if (project.images && project.images.length > 0) {
                const sortedImages = [...project.images].sort((a, b) => {
                    if (a.is_primary) return -1;
                    if (b.is_primary) return 1;
                    return a.order - b.order;
                });
                sortedImages.forEach((image) => {
                    if (image.image) {
                        imageUrls.push(image.image);
                    }
                });
            }
        });

        return imageUrls;
    }, [brandingProjects]);

    const { isLoaded: imagesLoaded, progress: loadingProgress } = useImageCache(allImageUrls);

    const projectsWithCachedImages = useMemo(() => {
        return brandingProjects.map((project) => ({
            ...project,
            images: project.images?.map((image) => ({
                ...image,
                cachedImageUrl: getCachedImageSrc(image.image),
            })),
        }));
    }, [brandingProjects, imagesLoaded]);

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

                {!imagesLoaded && (
                    <div className="mt-12 flex flex-col items-center space-y-4">
                        <div className="w-full max-w-md">
                            <div className="mb-2 flex justify-between text-sm text-gray-600">
                                <span>Loading images...</span>
                                <span>{loadingProgress}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                    style={{ width: `${loadingProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {!imagesLoaded
                        ? Array.from({ length: Math.min(brandingProjects.length, 6) }).map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
                        : projectsWithCachedImages.map((project) => <BrandingProjectCard key={project.id} project={project} />)}
                </div>

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
