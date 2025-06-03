import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { AnimationAndMotionImageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsLeft, ChevronsRight, Play, X } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '../ui/dialog';

export default function AnimationAndMotionCarouselSection() {
    const { animationAndMotionsVideos } = usePage<{ animationAndMotionsVideos: AnimationAndMotionImageT[] }>().props;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [api, setApi] = useState<CarouselApi>();

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedImage(null);
    };

    const handleOpenDialog = (id: number) => {
        setSelectedImage(id);
        setIsDialogOpen(true);
    };

    const handleNext = () => {
        api?.scrollNext();
    };

    const handlePrevious = () => {
        api?.scrollPrev();
    };

    if (!animationAndMotionsVideos || animationAndMotionsVideos.length === 0) return null;

    return (
        <div className="py-8">
            <Carousel
                opts={{
                    align: 'center',
                }}
                setApi={setApi}
                className="app-container"
            >
                <CarouselContent>
                    {animationAndMotionsVideos.map((image, index) => (
                        <CarouselItem key={index} className="w-full md:basis-2/3">
                            <div key={`sticker-${index}`} className="group relative mx-2 my-2 overflow-hidden rounded-2xl">
                                <video
                                    onClick={() => handleOpenDialog(image.id)}
                                    className="cursor-pointer rounded-2xl object-cover object-center shadow transition-transform duration-500 hover:scale-[1.2]"
                                    src={image.image}
                                />
                                <div className="absolute top-1/2 left-1/2 z-5 flex size-[80px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/60 transition-all duration-500 group-hover:border-white">
                                    <Play className="size-[3em] text-white/60 transition-all duration-500 group-hover:text-white" />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="my-3 hidden gap-5 select-none md:flex md:items-center md:justify-center">
                    <div
                        onClick={handlePrevious}
                        className="group flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm tracking-wide uppercase transition-all duration-500 hover:border-black"
                    >
                        <ChevronsLeft className="size-5 text-gray-500 transition-all duration-500 group-hover:text-black" />
                        <span>Previous</span>
                    </div>
                    <div
                        onClick={handleNext}
                        className="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm tracking-wide uppercase transition-all duration-500 hover:border-black"
                    >
                        <span>Next</span>
                        <ChevronsRight className="size-5 text-gray-500 transition-all duration-500 group-hover:text-black" />
                    </div>
                </div>
            </Carousel>

            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogOverlay className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm" />
                <DialogHeader>
                    <DialogTitle className="sr-only">Sticker Art</DialogTitle>
                </DialogHeader>
                <DialogContent className="z-50 max-w-3xl overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-none" showCloseBtn={false}>
                    <DialogClose asChild>
                        <button
                            className="absolute top-4 right-4 z-[20] rounded-md p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DialogClose>

                    {selectedImage && (
                        <video
                            controls
                            className="h-full w-full rounded object-cover object-center"
                            src={animationAndMotionsVideos.find((i) => i.id === selectedImage)?.image}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
