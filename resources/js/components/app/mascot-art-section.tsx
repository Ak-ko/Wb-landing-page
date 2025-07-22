import DynamicArtHeader from './dynamic-art-header';
import MascotArtPackagesSection from './mascot-art-packages-section';
import MascotCarouselSection from './mascot-carousel-section';

export default function MascotArtSection() {
    return (
        <div>
            <DynamicArtHeader
                title={
                    <>
                        <span className="text-[#FF5A01]">Mascot</span> Art
                    </>
                }
                description={`We don’t just draw characters; we craft brand ambassadors that connect with your audience. From cute monsters to cool superheroes, we’ll design a mascot that grabs attention and wins hearts. Ready to give your brand a friendly face that makes competitors say, "Why didn’t we think of that?"`}
                initialAnimationProperty={{
                    x: 100,
                    opacity: 0,
                }}
            />

            <MascotCarouselSection />

            <MascotArtPackagesSection />
        </div>
    );
}
