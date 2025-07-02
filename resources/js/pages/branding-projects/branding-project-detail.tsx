import BehanceIcon from '@/components/app/icons/social-links/benance-icon';
import ImageModal from '@/components/app/image-modal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import useTopScrollAnimation from '@/hooks/use-top-scroll-animation';
import LandingLayout from '@/layouts/landing-layout';
import { BrandingProjectT } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Building2, Calendar, Crown } from 'lucide-react';
import { useState } from 'react';

interface BrandingProjectDetailProps {
    project: BrandingProjectT;
    relatedProjects: BrandingProjectT[];
}

export default function BrandingProjectDetail({ project, relatedProjects }: BrandingProjectDetailProps) {
    const { topBarClass } = useTopScrollAnimation();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    return (
        <LandingLayout>
            <Head title={project.title} />
            <div className={`${topBarClass} bg-primary fixed top-0 left-0 z-[5] h-[5px] w-full origin-left`} />

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="relative h-[60vh] w-full overflow-hidden bg-black">
                    {project.images?.[0] && (
                        <>
                            <img src={project.images[0].image} alt={project.title} className="h-full w-full object-cover opacity-50" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </>
                    )}
                    <div className="absolute right-0 bottom-0 left-0 p-8 text-white">
                        <div className="app-container">
                            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">{project.title}</h1>
                            <div className="flex flex-wrap gap-6 text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Building2 size={20} />
                                    <span>{project.client_company}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={20} />
                                    <span>{project.year}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BehanceIcon fill="#d0d4db" className="mt-1 size-[25px]" />
                                    <a
                                        href={project.project_link as string}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white hover:underline"
                                    >
                                        View on Behance
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="app-container py-12">
                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Project Images */}
                            <div className="mb-12 overflow-hidden rounded-xl bg-white p-6 shadow-lg">
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {project.images.map((image, idx) => (
                                            <CarouselItem key={image.id}>
                                                <img
                                                    src={image.image}
                                                    alt={project.title}
                                                    className="w-full cursor-pointer rounded-lg object-cover shadow-md transition-transform duration-200 hover:scale-105"
                                                    onClick={() => {
                                                        setModalOpen(true);
                                                        setModalIndex(idx);
                                                    }}
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {project.images.length > 1 && (
                                        <>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </>
                                    )}
                                </Carousel>
                                {/* Modal for full image view */}
                                <ImageModal images={project.images} open={modalOpen} initialIndex={modalIndex} onClose={() => setModalOpen(false)} />
                            </div>

                            {/* Project Description */}
                            <div className="rounded-xl bg-white p-8 shadow-lg">
                                <h2 className="mb-6 text-2xl font-bold">Project Overview</h2>
                                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: project.description as string }} />

                                <div className="mt-8">
                                    <h3 className="mb-4 text-xl font-bold">Project Scope</h3>
                                    <div className="prose prose-lg max-w-none">
                                        {project?.project_scopes?.split('\n').map((scope, index) => (
                                            <p key={index} className="flex items-start gap-2">
                                                <span className="bg-primary mt-2 h-2 w-2 rounded-full" />
                                                {scope}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Project Info */}
                            <div className="rounded-xl bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-xl font-bold">Project Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Industry</h4>
                                        <p className="text-gray-900">{project.industry_type}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Keywords</h4>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {project?.project_keywords?.split(',').map((keyword, index) => (
                                                <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                                                    {keyword.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="rounded-xl bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-xl font-bold">Team Members</h3>
                                <div className="space-y-4">
                                    {project.members.map((member) => (
                                        <div key={member.id} className="relative flex items-center gap-4 rounded-lg bg-gray-50 p-3">
                                            {member.image && (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="border-primary/30 h-10 w-10 rounded-full border-2 object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="flex items-center gap-2 font-medium text-gray-900">
                                                    {member.name}
                                                    {member.pivot?.is_lead && (
                                                        <span
                                                            className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm"
                                                            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                                                        >
                                                            <Crown size={16} className="text-white" />
                                                            Leader
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-500">{member.designation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="rounded-xl bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-xl font-bold">Technologies & Tools</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="rounded-full px-3 py-1 text-sm font-medium"
                                            style={{ backgroundColor: tag.color, color: '#fff' }}
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Projects */}
                    {relatedProjects.length > 0 && (
                        <div className="mt-16">
                            <h2 className="mb-8 text-2xl font-bold">Related Projects</h2>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {relatedProjects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={route('branding-projects.detail', { project: project.id })}
                                        className="group block overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
                                    >
                                        {project.images?.[0] && (
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={project.images[0].image}
                                                    alt={project.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="mb-2 text-xl font-bold text-gray-900">{project.title}</h3>
                                            <p className="text-sm text-gray-600">{project.client_company}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </LandingLayout>
    );
}
