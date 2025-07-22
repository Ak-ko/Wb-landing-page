import AnimationAndMotionArtPackages from './animation-and-motion-art-packages';
import AnimationAndMotionCarouselSection from './animation-and-motion-carousel-section';
import DynamicArtHeader from './dynamic-art-header';

export default function AnimationAndArtSection() {
    return (
        <div>
            <DynamicArtHeader
                title={
                    <>
                        <span className="text-secondary-pink">Animation</span> <br />
                        <span className="text-crayola-blue"> & Motion </span>Art
                    </>
                }
                description={`Welcome to our illustration laboratory, where we transform concepts into visual gold! Our mad scientist artists wield pencils like wands, conjuring up illustrations that make eyes pop and jaws drop. Whether you need a whimsical wonderland or a futuristic cityscape, we're the alchemists who'll brew up the perfect visual potion. Fancy seeing your ideas wear their Sunday best? Step into our gallery of visual witchcraft!`}
            />

            <AnimationAndMotionCarouselSection />

            <AnimationAndMotionArtPackages />
        </div>
    );
}
