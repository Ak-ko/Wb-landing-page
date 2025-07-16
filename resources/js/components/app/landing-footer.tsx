import Marquee from 'react-fast-marquee';

export default function LandingFooter() {
    return (
        <div>
            <Marquee gradient={false} speed={20} direction="left" className="overflow-hidden">
                <img src="/assets/footer-mascot.png" className="h-[200px]" />
                <img src="/assets/footer-mascot.png" className="h-[200px]" />
            </Marquee>
        </div>
    );
}
