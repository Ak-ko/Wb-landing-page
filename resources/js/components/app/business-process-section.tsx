/* eslint-disable @typescript-eslint/no-unused-vars */
import { BusinessProcessT } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import BusinessProcessItem from './business-process-item';
import SectionHeader from './section-header';

export default function BusinessProcessSection() {
    const { businessProcesses } = usePage<{ businessProcesses: BusinessProcessT[] }>().props;
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);
    const [isInView, setIsInView] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [manualScroll, setManualScroll] = useState(false);

    useEffect(() => {
        if (!businessProcesses || businessProcesses.length === 0) return;

        const handleScroll = () => {
            if (!sectionRef.current) return;

            const sectionRect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if section is in view
            const isVisible = sectionRect.top < windowHeight && sectionRect.bottom > 0;
            setIsInView(isVisible);

            if (!isVisible) return;

            // Calculate section visibility percentage
            const visibleHeight = Math.min(windowHeight, sectionRect.bottom) - Math.max(0, sectionRect.top);
            const visibleRatio = visibleHeight / Math.min(sectionRect.height, windowHeight);

            // Determine if we're at the top or bottom of the section
            const isAtTop = sectionRect.top >= 0;
            const isAtBottom = sectionRect.bottom <= windowHeight;

            // Calculate scroll progress within the section
            let progress = 0;

            if (isAtTop) {
                progress = 0;
            } else if (isAtBottom) {
                progress = 1;
            } else {
                // Map the section position to a 0-1 range
                progress = Math.abs(sectionRect.top) / (sectionRect.height - windowHeight);
                progress = Math.max(0, Math.min(1, progress));
            }

            setScrollProgress(progress);

            // Determine scroll direction
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current) {
                setScrollDirection('down');
            } else if (currentScrollY < lastScrollY.current) {
                setScrollDirection('up');
            }
            lastScrollY.current = currentScrollY;

            // Calculate which item should be active based on scroll position
            const itemCount = businessProcesses.length;
            const newActiveIndex = Math.min(Math.max(Math.floor(progress * itemCount), 0), itemCount - 1);
            setActiveIndex(newActiveIndex);
        };

        // Use passive: true for better scroll performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [businessProcesses]);

    // Handle manual navigation
    const handleDotClick = (index: number) => {
        setManualScroll(true);
        setActiveIndex(index);
        // Reset manual scroll after animation completes
        setTimeout(() => setManualScroll(false), 700);
    };

    if (!businessProcesses || businessProcesses.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            className="relative bg-gradient-to-b from-white to-gray-50 py-20 dark:from-gray-900 dark:to-gray-950"
            // Removed fixed height to allow scrolling
        >
            {/* Background decorative elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
                <div className="bg-primary/20 absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
            </div>

            <div className="app-container z-10 mb-5 md:mb-10">
                <SectionHeader
                    header="Our Creative process"
                    description="Follow our proven step-by-step approach to transform your ideas into reality"
                />
            </div>

            <div ref={contentRef} className="app-container relative z-20 flex min-h-[70vh] items-center justify-center py-16">
                {businessProcesses.map((businessProcess, index) => (
                    <BusinessProcessItem
                        key={businessProcess.id}
                        businessProcess={businessProcess}
                        isActive={index === activeIndex}
                        index={index}
                        totalItems={businessProcesses.length}
                        scrollDirection={scrollDirection}
                    />
                ))}
            </div>

            {/* Navigation dots - now clickable */}
            <div
                className={`absolute top-1/2 right-8 z-30 hidden -translate-y-1/2 flex-col gap-3 md:flex ${!isInView ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            >
                {businessProcesses.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-16 w-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                            idx === activeIndex ? 'bg-primary scale-y-100' : 'scale-y-75 bg-gray-300 dark:bg-gray-700'
                        }`}
                        onClick={() => handleDotClick(idx)}
                    />
                ))}
            </div>

            {/* Mobile navigation dots - now clickable */}
            <div className="mt-4 flex justify-center space-x-3 md:hidden">
                {businessProcesses.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${
                            idx === activeIndex ? 'bg-primary scale-110' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                        onClick={() => handleDotClick(idx)}
                    />
                ))}
            </div>
        </section>
    );
}
