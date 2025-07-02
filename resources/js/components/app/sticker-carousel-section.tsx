import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { StickerArtImageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import ImageModal from './image-modal';

export default function StickerCarouselSection() {
    const { stickerArtImages } = usePage<{ stickerArtImages: StickerArtImageT[] }>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const handleOpenModal = (idx: number) => {
        setModalIndex(idx);
        setIsModalOpen(true);
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
                            <div key={`sticker-${index}`} className="mx-2 my-2 overflow-hidden rounded-lg">
                                <img
                                    onClick={() => handleOpenModal(index)}
                                    className="cursor-pointer rounded object-cover object-center transition-transform duration-500 hover:scale-[1.2]"
                                    src={image.image}
                                    alt={`sticker-${index}`}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {stickerArtImages.length > 1 && (
                    <>
                        <CarouselPrevious className="hidden transition-transform duration-500 hover:scale-[1.2] md:flex" />
                        <CarouselNext className="hidden transition-transform duration-500 hover:scale-[1.2] md:flex" />
                    </>
                )}
            </Carousel>

            <ImageModal images={stickerArtImages} open={isModalOpen} initialIndex={modalIndex} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
