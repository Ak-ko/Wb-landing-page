/* eslint-disable react-hooks/exhaustive-deps */
import { TestimonialT } from '@/types';
import { usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import SlideUpCarousel from '../common/slide-up-carousel';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '../ui/dialog';
import CloseQuote from './icons/close-quote';
import SectionHeader from './section-header';
import TestimonialCard from './testimonial-card';

export default function TestimonialSection() {
    const { testimonials } = usePage<{ testimonials: TestimonialT[] }>().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialT | null>(null);

    // Handle opening the dialog
    const handleOpenDialog = (testimonial: TestimonialT) => {
        setSelectedTestimonial(testimonial);
        setIsDialogOpen(true);
    };

    // Handle closing the dialog
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <>
            <section id="testimonials" className="app-container flex flex-col items-center py-32 lg:flex-row lg:justify-between 2xl:!px-[200px]">
                <SectionHeader
                    containerClass="lg:block "
                    headerClass="lg:text-start lg:max-w-sm"
                    descriptionClass="lg:text-start !lg:max-w-[350px]"
                    header="What our clients say"
                    description={
                        <div className="mt-3">
                            <span>We aren't just a great creative studio,</span>
                            <br />
                            <span> we're an excellent business partner.</span>
                        </div>
                    }
                />
                <div className="relative mt-18 w-full lg:mt-0 lg:w-[650px]">
                    <SlideUpCarousel
                        items={testimonials}
                        renderItem={(testimonial) => (
                            <TestimonialCard testimonial={testimonial} containerClass="w-full" onClick={() => handleOpenDialog(testimonial)} />
                        )}
                        onItemClick={handleOpenDialog}
                        autoPlay={!isDialogOpen}
                        containerHeight={420}
                        containerPadding={50}
                        interval={4000}
                        animationDuration={0.8}
                    />
                </div>
            </section>

            {/* Testimonial Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogHeader>
                    <DialogTitle className="sr-only">Client Testimonial</DialogTitle> {/* for accessibility */}
                </DialogHeader>
                <DialogOverlay className="bg-transparent backdrop-blur-sm" />
                <DialogContent showCloseBtn={false} className="max-w-3xl overflow-hidden rounded-2xl border-0 p-0">
                    <DialogClose asChild>
                        <button
                            className="absolute top-4 right-4 z-[20] rounded-md p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DialogClose>
                    {selectedTestimonial && (
                        <div className="relative overflow-hidden">
                            <div
                                className="absolute inset-0 z-0 opacity-10"
                                style={{
                                    background: `radial-gradient(circle at top right, ${selectedTestimonial.color_tag || '#6366f1'}, transparent 70%)`,
                                }}
                            />

                            <div className="relative z-10 p-6 md:p-8">
                                <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-start">
                                    {/* Profile image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={selectedTestimonial.image || '/assets/demo-testimonial-profile.png'}
                                            alt={selectedTestimonial.name || 'Client'}
                                            className="h-24 w-24 rounded-full border-4 object-cover shadow-lg"
                                            style={{ borderColor: selectedTestimonial.color_tag || '#6366f1' }}
                                        />
                                    </div>

                                    {/* Client info */}
                                    <div className="flex-grow">
                                        <h2 className="mb-1 text-2xl font-bold">{selectedTestimonial.name || 'Anonymous'}</h2>
                                        {selectedTestimonial.position && selectedTestimonial.company && (
                                            <p className="mb-2 text-lg" style={{ color: selectedTestimonial.color_tag || '#6366f1' }}>
                                                {selectedTestimonial.position}, {selectedTestimonial.company}
                                            </p>
                                        )}
                                        {selectedTestimonial.email && (
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{selectedTestimonial.email}</p>
                                        )}
                                        {selectedTestimonial.phone && (
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{selectedTestimonial.phone}</p>
                                        )}
                                    </div>

                                    {/* Quote icon */}
                                    <div className="absolute top-6 right-6 md:relative md:top-0 md:right-0">
                                        <CloseQuote color={selectedTestimonial.color_tag || '#6366f1'} width={80} />
                                    </div>
                                </div>

                                <div
                                    className="overflow-y-auto rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-800/50"
                                    style={{
                                        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.05), 0 0 0 1px ${selectedTestimonial.color_tag || '#6366f1'}20`,
                                    }}
                                >
                                    <p className="text-base leading-relaxed font-light">{selectedTestimonial.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
