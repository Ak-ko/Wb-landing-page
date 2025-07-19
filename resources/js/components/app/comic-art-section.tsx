import ComicCarouselSection from './comic-art-carousel';
import ComicArtPackagesSection from './comic-art-packages-section';
import DynamicArtHeader from './dynamic-art-header';

export default function ComicArtSection() {
    return (
        <div>
            <DynamicArtHeader
                title={
                    <>
                        <span className="text-secondary-orange">Comic</span> Art
                    </>
                }
                description={`Kapow! Bam! Zoom! That's the sound of your narrative getting a superhero makeover in our comic art fortress of solitude. We don't just draw comics; we stitch together visual tales that leap off the page in a single bound! Whether you're after a gritty noir or a cosmic adventure, our panel-bending artists are ready to give your story its cape and tights. Ready to see your ideas flex their muscles?`}
            />

            <ComicCarouselSection />

            <ComicArtPackagesSection />
        </div>
    );
}
