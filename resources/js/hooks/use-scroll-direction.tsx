import { useEffect, useState } from 'react';

interface UseScrollDirectionReturn {
    isVisible: boolean;
    isScrolled: boolean;
    scrollDirection: 'up' | 'down' | null;
}

const useScrollDirection = (): UseScrollDirectionReturn => {
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setIsScrolled(currentScrollY > 0);

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setScrollDirection('down');
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setScrollDirection('up');
                setIsVisible(true);
            }

            if (currentScrollY <= 50) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        let ticking = false;
        const throttledHandleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledHandleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [lastScrollY]);

    return { isVisible, isScrolled, scrollDirection };
};

export default useScrollDirection;
