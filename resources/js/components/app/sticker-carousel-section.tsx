import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { StickerArtImageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '../ui/dialog';

export default function StickerCarouselSection() {
    const { stickerArtImages } = usePage<{ stickerArtImages: StickerArtImageT[] }>().props;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedImage(null);
    };

    const handleOpenDialog = (id: number) => {
        setSelectedImage(id);
        setIsDialogOpen(true);
    };

    if (!stickerArtImages || stickerArtImages.length === 0) return null;

    return (
        <div className="py-8">
            <Carousel
                opts={{
                    align: 'start',
                }}
                className="app-container"
            >
                <CarouselContent>
                    {stickerArtImages.map((image, index) => (
                        <CarouselItem key={index} className="w-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <div key={`sticker-${index}`} className="mx-2 my-2 overflow-hidden">
                                <img
                                    onClick={() => handleOpenDialog(image.id)}
                                    className="cursor-pointer rounded object-cover object-center transition-transform duration-500 hover:scale-[1.2]"
                                    src={image.image}
                                    alt={`sticker-${index}`}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden transition-transform duration-500 hover:scale-[1.2] md:flex" />
                <CarouselNext className="hidden transition-transform duration-500 hover:scale-[1.2] md:flex" />
            </Carousel>

            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogOverlay className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm" />
                <DialogContent className="z-50 max-w-3xl overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-none" showCloseBtn={false}>
                    <DialogClose asChild>
                        <button
                            className="absolute top-4 right-4 z-[20] rounded-md p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DialogClose>
                    <DialogHeader>
                        <DialogTitle className="sr-only">Sticker Art</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                        <img
                            className="h-full w-full rounded object-cover object-center"
                            src={stickerArtImages.find((i) => i.id === selectedImage)?.image}
                            alt="Selected sticker"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
