import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { BrandingProjectImageT } from '@/types';
import { useEffect, useState } from 'react';

interface ProjectImageCarouselProps {
    images: BrandingProjectImageT[];
    projectTitle: string;
    className?: string;
}

export default function ProjectImageCarousel({ images, projectTitle, className }: ProjectImageCarouselProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrentIndex(api.selectedScrollSnap());

        api.on('select', () => {
            setCurrentIndex(api.selectedScrollSnap());
        });
    }, [api]);

    if (!images || images.length === 0) {
        return (
            <div className={cn('flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50', className)}>
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    return (
        <div className={cn('space-y-3', className)}>
            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={image.id}>
                            <div className="p-1">
                                <div className="overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg">
                                    <img
                                        src={`${image.image}`}
                                        alt={`${projectTitle} - Image ${index + 1}`}
                                        className="aspect-video h-auto w-full object-cover"
                                    />
                                </div>
                                {image.is_primary && <div className="text-primary mt-2 text-center text-sm font-medium">Primary Image</div>}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </Carousel>

            {/* Image indicators */}
            <div className="mt-2 flex justify-center gap-2">
                {images.map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                            'h-2 w-2 rounded-full transition-all',
                            currentIndex === index ? 'bg-primary w-4' : 'bg-gray-300 hover:bg-gray-400',
                        )}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
