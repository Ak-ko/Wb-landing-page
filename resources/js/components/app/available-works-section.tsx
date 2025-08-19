import { usePage } from '@inertiajs/react';
import Marquee from 'react-fast-marquee';
import AvailableWorkBadge from './available-work-badge';

import { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';

export default function AvailableWorksSection() {
    const isMobile = useIsMobile();
    const [isTablet, setIsTablet] = useState(false);
    const { availableWorks } = usePage().props;

    const renderBadges = () => {
        if (!availableWorks || !Array.isArray(availableWorks) || availableWorks.length === 0) {
            return <div className="py-4 text-center">No available works found</div>;
        }

        const repeatedBadges = [...availableWorks, ...availableWorks, ...availableWorks, ...availableWorks];

        return repeatedBadges.map((work: { id: number; label: string; color: string; text_color: string }, index) => (
            <div key={`badge-${work.id}-${index}`} className="mx-2 my-2">
                <AvailableWorkBadge
                    label={work.label}
                    style={{
                        backgroundColor: work.color,
                    }}
                    textColor={work.text_color}
                />
            </div>
        ));
    };

    useEffect(() => {
        const handleResize = () => {
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1100);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMobile && !isTablet) {
        return (
            <div className="w-full py-4">
                <div className="flex flex-col space-y-3">
                    <Marquee gradient={false} speed={20} direction="left" className="overflow-hidden">
                        {renderBadges()}
                    </Marquee>
                    <Marquee gradient={false} speed={35} direction="right" className="overflow-hidden">
                        {renderBadges()}
                    </Marquee>
                    <Marquee gradient={false} speed={25} direction="left" className="overflow-hidden">
                        {renderBadges()}
                    </Marquee>
                </div>
            </div>
        );
    } else if (isTablet) {
        return (
            <div className="w-full py-4">
                <div className="flex flex-col space-y-3">
                    <Marquee gradient={false} speed={30} direction="left" className="overflow-hidden">
                        {renderBadges()}
                    </Marquee>
                    <Marquee gradient={false} speed={40} direction="right" className="overflow-hidden">
                        {renderBadges()}
                    </Marquee>
                </div>
            </div>
        );
    } else {
        return (
            <div className="w-full py-4">
                <div className="flex">
                    <Marquee gradient={false} speed={40} className="overflow-hidden">
                        {renderBadges()}
                    </Marquee>
                </div>
            </div>
        );
    }
}
