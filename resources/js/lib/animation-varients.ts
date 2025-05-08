export const scrollUpVarients = {
    enter: {
        y: '100%',
        opacity: 1,
    },
    center: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
    exit: {
        y: '-100%',
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
};
