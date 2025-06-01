import DynamicArtHeader from './dynamic-art-header';
import MascotCarouselSection from './mascot-carousel-section';

export default function MascotArtSection() {
    return (
        <div className="my-20">
            <DynamicArtHeader
                containerClass="flex flex-col items-end"
                title={
                    <>
                        <span className="text-[#FF5A01]">Mascot</span> Art
                    </>
                }
                titleClass="md:text-end text-center"
                description={`We don’t just draw characters; we craft brand ambassadors that connect with your audience. From cute monsters to cool superheroes, we’ll design a mascot that grabs attention and wins hearts. Ready to give your brand a friendly face that makes competitors say, "Why didn’t we think of that?"`}
                descriptionClass="md:text-end md:ml-auto text-center"
            />

            <MascotCarouselSection />
        </div>
    );
}
