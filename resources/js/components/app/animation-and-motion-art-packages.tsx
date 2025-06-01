import { ArtPackageT } from '@/types';
import { usePage } from '@inertiajs/react';
import DynamicArtPackageCard from './dynamic-art-package-card';
import SectionHeader from './section-header';

export default function AnimationAndMotionArtPackages() {
    const { animationAndMotionArtPackages } = usePage<{ animationAndMotionArtPackages: ArtPackageT[] }>().props;

    if (!animationAndMotionArtPackages || animationAndMotionArtPackages?.length === 0) return null;

    return (
        <section className="bg-[#F5F5F5] py-16">
            <div className="app-container">
                <SectionHeader
                    header={
                        <>
                            <span className="text-secondary-orange">Animation & Motion</span> <br />
                            art packages
                        </>
                    }
                />

                <div className="grid grid-cols-1 gap-5 px-5 py-10 md:grid-cols-2 lg:grid-cols-3 lg:px-20">
                    {animationAndMotionArtPackages?.map((artPackage) => <DynamicArtPackageCard key={artPackage.id} artPackage={artPackage} />)}
                </div>
            </div>
        </section>
    );
}
