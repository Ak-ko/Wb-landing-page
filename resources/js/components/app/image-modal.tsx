import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export default function ImageModal<ImgT extends { id: number; image: string }>({
    images,
    open,
    initialIndex,
    onClose,
    showIndicators = false,
}: {
    images: ImgT[];
    open: boolean;
    initialIndex: number;
    onClose: () => void;
    showIndicators?: boolean;
}) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

    // Check if file is a video based on extension
    const isVideo = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
        const extension = url.toLowerCase().substring(url.lastIndexOf('.'));
        return videoExtensions.includes(extension);
    };

    // Navigation helper function
    const scrollToImage = (index: number) => {
        if (index >= 0 && index < images.length && itemRefs.current[index]) {
            itemRefs.current[index]?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            setCurrentIndex(index);
        }
    };

    // Use the reusable keyboard navigation hook
    useKeyboardNavigation({
        isActive: open,
        totalItems: images.length,
        currentIndex,
        onNavigate: scrollToImage,
        onClose,
        enableArrowKeys: true,
        enableEscapeKey: true,
    });

    // Handle body scroll prevention
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    // Scroll to initial item when modal opens
    useEffect(() => {
        if (open && initialIndex >= 0) {
            setCurrentIndex(initialIndex);
            setTimeout(() => {
                scrollToImage(initialIndex);
            }, 100);
        }
    }, [open, initialIndex]);

    // Track which image is currently in view for accurate indicators
    useEffect(() => {
        if (!open) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = itemRefs.current.findIndex((ref) => ref === entry.target);
                        if (index !== -1) {
                            setCurrentIndex(index);
                        }
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of the image is visible
                rootMargin: '0px',
            },
        );

        // Observe all image containers
        itemRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            observer.disconnect();
        };
    }, [open, images.length]);

    if (!open || !images || images.length === 0) return null;

    // Portal target
    const modalRoot = typeof window !== 'undefined' ? document.body : null;

    const modalContent = (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-black">
            {/* Close Button */}
            <button
                className="fixed top-6 right-8 z-[1010] rounded-full bg-black/60 p-3 text-white transition-all hover:scale-110 hover:bg-black/80"
                onClick={onClose}
                aria-label="Close modal"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {/* Vertical scrollable content */}
            <div
                ref={scrollContainerRef}
                className="h-full w-full overflow-y-auto"
                style={{
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4B5563 #000000',
                }}
            >
                <div className="flex flex-col">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            ref={(el) => {
                                itemRefs.current[index] = el;
                            }}
                            className="flex w-full items-center justify-center"
                        >
                            {isVideo(image.image) ? (
                                <video
                                    src={image.image}
                                    className="h-full w-full object-contain"
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    onError={(e) => {
                                        console.error('Video failed to load:', image.image);
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <img
                                    src={image.image}
                                    alt={`Image ${index + 1}`}
                                    className="h-full w-full object-contain"
                                    loading={index <= 2 ? 'eager' : 'lazy'} // Load first few images immediately
                                    onError={(e) => {
                                        console.error('Image failed to load:', image.image);
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll indicator (optional) */}
            {showIndicators && images.length > 1 && (
                <div className="fixed top-1/2 right-6 z-[1010] flex -translate-y-1/2 flex-col gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 w-2 rounded-full transition-all hover:bg-white/60 ${index === currentIndex ? 'bg-white' : 'bg-white/30'}`}
                            onClick={() => scrollToImage(index)}
                            aria-label={`Go to ${isVideo(images[index].image) ? 'video' : 'image'} ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null;
}
