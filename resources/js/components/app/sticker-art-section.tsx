import DynamicArtHeader from './dynamic-art-header';
import StickerArtPackages from './sticker-art-packages';
import StickerCarouselSection from './sticker-carousel-section';

export default function StickerArtSection() {
    return (
        <div>
            <div className="bg-black">
                <DynamicArtHeader
                    containerClass="flex flex-col items-end"
                    title={
                        <>
                            <span className="text-primary-orange">Sticker</span> Art
                        </>
                    }
                    titleClass="md:text-start text-center"
                    description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}
                    descriptionClass="md:text-start  text-center"
                />
                <StickerCarouselSection />
            </div>

            <StickerArtPackages />
        </div>
    );
}
