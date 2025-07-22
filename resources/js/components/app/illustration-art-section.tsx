import DynamicArtHeader from './dynamic-art-header';
import IllustrationArtPackagesSection from './illustration-art-packages-section';
import IllustrationCarouselSection from './illustration-carousel-section';

export default function IllustrationArtSection() {
    return (
        <div>
            <DynamicArtHeader
                title={
                    <>
                        <span className="text-secondary-pink">Illustration</span> Art
                    </>
                }
                description={`Welcome to our illustration laboratory, where we transform concepts into visual gold! Our mad alchemist artists wield pencils like wands, conjuring up illustrations that make eyes pop and jaws drop. Whether you need a whimsical wonderland or a futuristic cityscape, we're the alchemists who'll brew up the perfect visual potion. Fancy seeing your ideas wear their Sunday best? Step into our gallery of visual witchcraft!`}
            />

            <IllustrationCarouselSection />

            <IllustrationArtPackagesSection />
        </div>
    );
}
