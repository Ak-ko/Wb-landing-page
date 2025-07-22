export const scrollUpVarients = {
    enter: {
        y: '100%',
        opacity: 0,
    },
    center: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth animation
        },
    },
    exit: {
        y: '-100%',
        opacity: 0,
        transition: {
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth animation
        },
    },
};
