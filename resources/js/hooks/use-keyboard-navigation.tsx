import { useCallback, useEffect } from 'react';

interface UseKeyboardNavigationProps {
    isActive: boolean;
    totalItems: number;
    currentIndex: number;
    onNavigate: (index: number) => void;
    onClose?: () => void;
    enableArrowKeys?: boolean;
    enableEscapeKey?: boolean;
}

export function useKeyboardNavigation({
    isActive,
    totalItems,
    currentIndex,
    onNavigate,
    onClose,
    enableArrowKeys = true,
    enableEscapeKey = true,
}: UseKeyboardNavigationProps) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!isActive) return;

            switch (event.key) {
                case 'Escape':
                    if (enableEscapeKey && onClose) {
                        event.preventDefault();
                        onClose();
                    }
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    if (enableArrowKeys) {
                        event.preventDefault();
                        const prevIndex = Math.max(0, currentIndex - 1);
                        onNavigate(prevIndex);
                    }
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    if (enableArrowKeys) {
                        event.preventDefault();
                        const nextIndex = Math.min(totalItems - 1, currentIndex + 1);
                        onNavigate(nextIndex);
                    }
                    break;
            }
        },
        [isActive, totalItems, currentIndex, onNavigate, onClose, enableArrowKeys, enableEscapeKey],
    );

    useEffect(() => {
        if (isActive) {
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isActive, handleKeyDown]);

    return {
        // Additional utilities can be added here if needed
        navigateToFirst: () => onNavigate(0),
        navigateToLast: () => onNavigate(totalItems - 1),
        navigatePrevious: () => onNavigate(Math.max(0, currentIndex - 1)),
        navigateNext: () => onNavigate(Math.min(totalItems - 1, currentIndex + 1)),
    };
}
