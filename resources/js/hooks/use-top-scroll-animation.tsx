import { useEffect } from 'react';

const topBarClass = 'top__line__progress';
const useTopScrollAnimation = (): { topBarClass: string } => {
    useEffect(() => {
        const progress = document.querySelector(`.${topBarClass}`) as HTMLElement;

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progressRatio = scrollTop / docHeight;

            if (progress) {
                progress.style.transform = `scaleX(${progressRatio})`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return {
        topBarClass,
    };
};

export default useTopScrollAnimation;
