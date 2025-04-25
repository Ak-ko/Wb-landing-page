import { useCallback } from 'react';

/**
 * A custom hook that provides smooth scrolling functionality to elements
 * @returns A function that scrolls to an element by its selector
 */
const useScroll = () => {
    /**
     * Scrolls smoothly to an element identified by a selector
     * @param selector - The CSS selector (class or id) of the target element
     * @param offset - Optional vertical offset in pixels (default: 0)
     * @param duration - Optional duration of the scroll animation in ms (default: 1000)
     */
    const scrollTo = useCallback((selector: string, offset = 0, duration = 1000) => {
        const element = document.getElementById(selector.split('#').join(''));

        if (!element) {
            console.warn(`Element with selector "${selector}" not found`);
            return;
        }

        const elementPosition = element.getBoundingClientRect().top;

        const startPosition = window.pageYOffset;

        const targetPosition = elementPosition + startPosition - offset;

        let startTime: number | null = null;

        function animation(currentTime: number) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);

            window.scrollTo(0, startPosition + (targetPosition - startPosition) * ease(progress));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }, []);

    return { scrollTo };
};

export default useScroll;
