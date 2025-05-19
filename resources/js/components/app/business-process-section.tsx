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
    const [isFixed, setIsFixed] = useState(false);
    const [hasPassedAllSteps, setHasPassedAllSteps] = useState(false);
    const sectionHeight = useRef(0);
    const sectionTop = useRef(0);
    const scrollStart = useRef(0);
    const scrollEnd = useRef(0);
    const [transitionState, setTransitionState] = useState<'entering' | 'fixed' | 'leaving' | 'none'>('none');

    // Calculate the total height needed for the section
    useEffect(() => {
        if (!businessProcesses || businessProcesses.length === 0 || !sectionRef.current) return;

        // Set initial values when component mounts
        const updateSectionMetrics = () => {
            if (!sectionRef.current) return;

            // Store the natural height of the section
            sectionHeight.current = sectionRef.current.offsetHeight;

            // Calculate where the fixed scroll should start and end
            const rect = sectionRef.current.getBoundingClientRect();
            sectionTop.current = window.scrollY + rect.top;

            // Start fixing when the section top reaches the top of the viewport
            // Add a small offset to start fixing slightly before reaching the top
            scrollStart.current = sectionTop.current - window.innerHeight * 0.1;

            // End fixing after scrolling through all steps (one viewport height per step)
            const stepsHeight = window.innerHeight * businessProcesses.length * 0.8; // Reduced multiplier for better pacing
            scrollEnd.current = scrollStart.current + stepsHeight;

            // Update the section's placeholder height to accommodate the scrolling experience
            if (sectionRef.current) {
                sectionRef.current.style.height = `${stepsHeight + sectionHeight.current}px`;
            }
        };

        updateSectionMetrics();
        window.addEventListener('resize', updateSectionMetrics);

        return () => {
            window.removeEventListener('resize', updateSectionMetrics);
        };
    }, [businessProcesses]);

    useEffect(() => {
        if (!businessProcesses || businessProcesses.length === 0) return;

        const handleScroll = () => {
            if (!sectionRef.current) return;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Determine scroll direction
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current) {
                setScrollDirection('down');
            } else if (currentScrollY < lastScrollY.current) {
                setScrollDirection('up');
            }
            lastScrollY.current = currentScrollY;

            // Calculate transition thresholds for smoother animations
            const enteringThreshold = scrollStart.current - windowHeight * 0.2;
            const leavingThreshold = scrollEnd.current - windowHeight * 0.2;

            // Check if section should be in fixed position
            const shouldBeFixed = scrollY >= scrollStart.current && scrollY < scrollEnd.current;

            // Set transition state for smoother animations
            if (scrollY >= enteringThreshold && scrollY < scrollStart.current) {
                setTransitionState('entering');
            } else if (shouldBeFixed) {
                setTransitionState('fixed');
            } else if (scrollY >= scrollEnd.current && scrollY < leavingThreshold) {
                setTransitionState('leaving');
            } else {
                setTransitionState('none');
            }

            setIsFixed(shouldBeFixed);

            // Check if we've passed all steps
            setHasPassedAllSteps(scrollY >= scrollEnd.current);

            // Check if section is in view
            const sectionRect = sectionRef.current.getBoundingClientRect();
            const isVisible = sectionRect.top < windowHeight && sectionRect.bottom > 0;
            setIsInView(isVisible);

            if (shouldBeFixed) {
                // Calculate which step to show based on scroll position
                const scrollProgress = (scrollY - scrollStart.current) / (scrollEnd.current - scrollStart.current);
                const itemCount = businessProcesses.length;
                const newActiveIndex = Math.min(Math.floor(scrollProgress * itemCount), itemCount - 1);

                setActiveIndex(newActiveIndex);
            } else if (scrollY < scrollStart.current) {
                // Before the fixed section, show the first step
                setActiveIndex(0);
            }
        };

        // Use throttled scroll event for better performance
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', throttledScroll);
        };
    }, [businessProcesses]);

    // Handle manual navigation
    const handleDotClick = (index: number) => {
        if (!sectionRef.current) return;

        // Calculate the scroll position for the selected step
        const stepHeight = (scrollEnd.current - scrollStart.current) / businessProcesses.length;
        const targetScroll = scrollStart.current + stepHeight * index;

        // Smooth scroll to the target position
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth',
        });
    };

    if (!businessProcesses || businessProcesses.length === 0) return null;

    // Calculate opacity and transform values for smooth transitions
    const getTransitionStyles = () => {
        if (transitionState === 'entering') {
            // Calculate progress of entering transition (0 to 1)
            const progress = (lastScrollY.current - (scrollStart.current - window.innerHeight * 0.2)) / (window.innerHeight * 0.2);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            return {
                opacity: clampedProgress,
                transform: `translateY(${(1 - clampedProgress) * 50}px)`,
            };
        } else if (transitionState === 'leaving') {
            // Calculate progress of leaving transition (0 to 1)
            const progress = (lastScrollY.current - scrollEnd.current) / (window.innerHeight * 0.2);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            return {
                opacity: 1 - clampedProgress,
                transform: hasPassedAllSteps ? `translateY(${scrollEnd.current - sectionTop.current}px)` : `translateY(${clampedProgress * -50}px)`,
            };
        } else if (transitionState === 'fixed') {
            return {
                opacity: 1,
                transform: 'translateY(0)',
            };
        } else if (hasPassedAllSteps) {
            return {
                opacity: 1,
                transform: `translateY(${scrollEnd.current - sectionTop.current}px)`,
            };
        }
        return {
            opacity: 1,
            transform: 'translateY(0)',
        };
    };

    const transitionStyles = getTransitionStyles();

    return (
        <section ref={sectionRef} className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
            {/* Background decorative elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
                <div className="bg-primary/20 absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
            </div>

            {/* Content container with fixed positioning when in view */}
            <div
                className={`w-full py-10 ${isFixed ? 'fixed top-0 right-0 left-0' : ''} ${hasPassedAllSteps ? 'relative' : ''}`}
                style={{
                    ...transitionStyles,
                    zIndex: 10,
                    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                }}
            >
                <div className="app-container mb-4 md:mb-6">
                    <SectionHeader
                        header="Our Creative process"
                        description="Follow our proven step-by-step approach to transform your ideas into reality"
                    />
                </div>

                <div ref={contentRef} className="app-container relative z-20 flex min-h-[60vh] items-center justify-center py-8">
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
            </div>
        </section>
    );
}
