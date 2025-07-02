import { ComicArtImageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import ImageModal from './image-modal';

export default function ComicCarouselSection() {
    const { comicArtImages } = usePage<{ comicArtImages: ComicArtImageT[] }>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const handleOpenModal = (idx: number) => {
        setModalIndex(idx);
        setIsModalOpen(true);
    };

    if (!comicArtImages || comicArtImages.length === 0) return null;

    return (
        <div className="py-8">
            <Marquee pauseOnClick pauseOnHover gradient={false} speed={50} direction="left" className="overflow-hidden">
                {comicArtImages.map((image, index) => (
                    <div key={`illustration-${index}`} className="mx-2 my-2 overflow-hidden rounded-lg">
                        <img
                            onClick={() => handleOpenModal(index)}
                            className="h-[450px] w-[800px] cursor-pointer rounded object-cover object-center transition-transform duration-500 hover:scale-[1.2]"
                            src={image.image}
                            alt={`illustration-${index}`}
                        />
                    </div>
                ))}
            </Marquee>

            <ImageModal images={comicArtImages} open={isModalOpen} initialIndex={modalIndex} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
