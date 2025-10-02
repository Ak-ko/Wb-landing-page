import BrandingProjectCard from '@/components/app/branding-project-card';
import BehanceIcon from '@/components/app/icons/social-links/benance-icon';
import ImageModal from '@/components/app/image-modal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ThemedAccordion from '@/components/ui/themed-accordion';
import useTopScrollAnimation from '@/hooks/use-top-scroll-animation';
import LandingLayout from '@/layouts/landing-layout';
import { BrandingProjectT } from '@/types';
import { Head } from '@inertiajs/react';
import { Building2, Calendar, Crown, MapPin, Play } from 'lucide-react';
import { useRef, useState } from 'react';

interface BrandingProjectDetailProps {
    project: BrandingProjectT;
    relatedProjects: BrandingProjectT[];
}

export default function BrandingProjectDetail({ project, relatedProjects }: BrandingProjectDetailProps) {
    const { topBarClass } = useTopScrollAnimation();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [videoPlaying, setVideoPlaying] = useState<{ [key: string]: boolean }>({});
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

    // Check if file is a video based on extension
    const isVideo = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
        const extension = url.toLowerCase().substring(url.lastIndexOf('.'));
        return videoExtensions.includes(extension);
    };

    // Handle video click - play/pause without opening modal if clicking on video controls
    const handleVideoClick = (idx: number, event: React.MouseEvent) => {
        const video = videoRefs.current[`video-${idx}`];
        if (!video) return;

        // Check if click was on video controls (bottom part of video)
        const rect = video.getBoundingClientRect();
        const clickY = event.clientY - rect.top;
        const videoHeight = rect.height;
        const controlsArea = videoHeight - 50; // Approximate controls area

        if (clickY > controlsArea && video.controls) {
            // Click was in controls area, don't open modal
            event.stopPropagation();
            return;
        }

        // Click was on video content, open modal
        setModalOpen(true);
        setModalIndex(idx);
    };

    // Handle video play/pause events
    const handleVideoPlay = (idx: number) => {
        setVideoPlaying((prev) => ({ ...prev, [`video-${idx}`]: true }));
    };

    const handleVideoPause = (idx: number) => {
        setVideoPlaying((prev) => ({ ...prev, [`video-${idx}`]: false }));
    };

    // Handle play button click
    const handlePlayButtonClick = (idx: number, event: React.MouseEvent) => {
        event.stopPropagation();
        const video = videoRefs.current[`video-${idx}`];
        if (video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    };

    // Prepare accordion items
    const accordionItems = [
        {
            id: 'project-details',
            title: 'Project Details',
            content: (
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
            ),
        },
        // Only show team members section if there are members
        ...(project.members && project.members.length > 0
            ? [
                  {
                      id: 'team-members',
                      title: 'Team Members',
                      content: (
                          <div className="space-y-4">
                              {project.members.map((member) => (
                                  <div key={member.id} className="relative flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm">
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
                                              {!!member?.pivot?.is_lead && (
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
                      ),
                  },
              ]
            : []),
        // Only show technologies section if there are tags
        ...(project.tags && project.tags.length > 0
            ? [
                  {
                      id: 'technologies',
                      title: 'Fields',
                      content: (
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
                      ),
                  },
              ]
            : []),
    ];

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
                                {project.client_origin && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={20} />
                                        <span>{project.client_origin}</span>
                                    </div>
                                )}
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
                        <div className="lg:col-span-2">
                            <div className="mb-12 overflow-hidden rounded-xl bg-white p-6 shadow-lg">
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {project.images.map((image, idx) => (
                                            <CarouselItem key={image.id}>
                                                <div className="group relative aspect-video overflow-hidden rounded-lg">
                                                    {isVideo(image.image) ? (
                                                        <>
                                                            <video
                                                                ref={(el) => {
                                                                    videoRefs.current[`video-${idx}`] = el;
                                                                }}
                                                                autoPlay
                                                                src={image.image}
                                                                className="h-full w-full cursor-pointer object-cover transition-transform duration-200 hover:scale-105"
                                                                onClick={(e) => handleVideoClick(idx, e)}
                                                                onPlay={() => handleVideoPlay(idx)}
                                                                onPause={() => handleVideoPause(idx)}
                                                                muted
                                                                preload="metadata"
                                                                playsInline
                                                                controls
                                                                controlsList="nodownload"
                                                            />
                                                            {!videoPlaying[`video-${idx}`] && (
                                                                <div
                                                                    className="absolute top-1/2 left-1/2 z-5 flex size-[60px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-4 border-white/60 transition-all duration-500 group-hover:border-white"
                                                                    onClick={(e) => handlePlayButtonClick(idx, e)}
                                                                >
                                                                    <Play
                                                                        className="size-[30px] text-white/60 transition-all duration-500 group-hover:text-white"
                                                                        fill="currentColor"
                                                                    />
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <img
                                                            src={image.image}
                                                            alt={project.title}
                                                            className="h-full w-full cursor-pointer object-cover transition-transform duration-200 hover:scale-105"
                                                            onClick={() => {
                                                                setModalOpen(true);
                                                                setModalIndex(idx);
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {project.images.length > 1 && (
                                        <>
                                            <CarouselPrevious className="left-4 h-10 w-10 bg-white/90 text-gray-900 shadow-lg hover:bg-white" />
                                            <CarouselNext className="right-4 h-10 w-10 bg-white/90 text-gray-900 shadow-lg hover:bg-white" />
                                        </>
                                    )}
                                </Carousel>
                                <ImageModal images={project.images} open={modalOpen} initialIndex={modalIndex} onClose={() => setModalOpen(false)} />
                            </div>

                            <div className="rounded-xl bg-white p-8 shadow-lg">
                                <h2 className="mb-6 text-2xl font-bold">Project Overview</h2>
                                <div
                                    className="prose prose-lg max-w-none font-light [&_.text-center]:text-center [&_.text-left]:text-left [&_.text-right]:text-right [&_em]:italic [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-bold [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_ol]:ml-3 [&_ol]:list-decimal [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_ul]:ml-3 [&_ul]:list-disc [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                    dangerouslySetInnerHTML={{ __html: project.description as string }}
                                />

                                <div className="mt-8">
                                    <h3 className="mb-4 text-xl font-bold">Project Scope</h3>
                                    <div
                                        className="prose prose-lg max-w-none font-light [&_.text-center]:text-center [&_.text-left]:text-left [&_.text-right]:text-right [&_em]:italic [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-bold [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_ol]:ml-3 [&_ol]:list-decimal [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_ul]:ml-3 [&_ul]:list-disc [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                        dangerouslySetInnerHTML={{ __html: project.project_scopes || '' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <ThemedAccordion items={accordionItems} />
                        </div>
                    </div>

                    {relatedProjects.length > 0 && (
                        <div className="mt-16">
                            <h2 className="mb-8 text-2xl font-bold">Related Projects</h2>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {relatedProjects.map((project) => (
                                    <BrandingProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </LandingLayout>
    );
}
