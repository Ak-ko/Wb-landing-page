import Marquee from 'react-fast-marquee';
import AvailableWorkBadge from './available-work-badge';

import { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';

export default function AvailableWorksSection() {
    const isMobile = useIsMobile();
    const [isTablet, setIsTablet] = useState(false);

    const badges = [
        { label: 'Brand Guidelines', className: 'bg-[#FEC901]' },
        { label: 'Social Media Designs', className: 'bg-[#FF5A01] text-white' },
        { label: 'Logos', className: 'bg-[#1274EF] text-white' },
        { label: 'Branding', className: 'bg-[#FF1466] text-white' },
        { label: 'Rebranding', className: 'bg-[#101010] text-white' },

        { label: 'Brand Guidelines', className: 'bg-[#FEC901]' },
        { label: 'Social Media Designs', className: 'bg-[#FF5A01] text-white' },
        { label: 'Logos', className: 'bg-[#1274EF] text-white' },
        { label: 'Branding', className: 'bg-[#FF1466] text-white' },
        { label: 'Rebranding', className: 'bg-[#101010] text-white' },

        { label: 'Brand Guidelines', className: 'bg-[#FEC901]' },
        { label: 'Social Media Designs', className: 'bg-[#FF5A01] text-white' },
        { label: 'Logos', className: 'bg-[#1274EF] text-white' },
        { label: 'Branding', className: 'bg-[#FF1466] text-white' },
        { label: 'Rebranding', className: 'bg-[#101010] text-white' },

        { label: 'Brand Guidelines', className: 'bg-[#FEC901]' },
        { label: 'Social Media Designs', className: 'bg-[#FF5A01] text-white' },
        { label: 'Logos', className: 'bg-[#1274EF] text-white' },
        { label: 'Branding', className: 'bg-[#FF1466] text-white' },
        { label: 'Rebranding', className: 'bg-[#101010] text-white' },
    ];

    const renderBadges = () => {
        return badges.map((badge, index) => (
            <div key={`badge-${index}`} className="mx-2 my-2">
                <AvailableWorkBadge label={badge.label} className={badge.className} />
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
