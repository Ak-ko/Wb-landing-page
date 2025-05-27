import Marquee from 'react-fast-marquee';

export default function LandingFooter() {
    return (
        <div>
            <Marquee gradient={false} speed={50} direction="left" className="overflow-hidden">
                <img src="/assets/footer-mascot.png" />
            </Marquee>
        </div>
    );
}
