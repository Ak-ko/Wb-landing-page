import { IllustrationArtImageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '../ui/dialog';

export default function IllustrationCarouselSection() {
    const { illustrationArtImages } = usePage<{ illustrationArtImages: IllustrationArtImageT[] }>().props;
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

    if (!illustrationArtImages || illustrationArtImages.length === 0) return null;

    return (
        <div className="py-8">
            <Marquee pauseOnClick pauseOnHover gradient={false} speed={50} direction="left" className="overflow-hidden">
                {illustrationArtImages.map((image, index) => (
                    <div key={`illustration-${index}`} className="mx-2 my-2 overflow-hidden">
                        <img
                            onClick={() => handleOpenDialog(image.id)}
                            className="w-[800px] cursor-pointer rounded object-cover object-center transition-transform duration-500 hover:scale-[1.2]"
                            src={image.image}
                            alt={`illustration-${index}`}
                        />
                    </div>
                ))}
            </Marquee>

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
                        <DialogTitle className="sr-only">Illustration Art</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                        <img
                            className="h-full w-full rounded object-cover object-center"
                            src={illustrationArtImages.find((i) => i.id === selectedImage)?.image}
                            alt="Selected illustration"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
