import { ArtPackageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

import DynamicArtPackageCard from './dynamic-art-package-card';
import SectionHeader from './section-header';

export default function MascotArtPackagesSection() {
    const { mascotArtPackages } = usePage<{ mascotArtPackages: ArtPackageT[] }>().props;

    if (!mascotArtPackages || mascotArtPackages?.length === 0) return null;

    return (
        <section className="bg-[#F5F5F5] py-16">
            <div className="app-container">
                <SectionHeader
                    header={
                        <>
                            <span className="text-secondary-orange">Mascot</span> art packages
                        </>
                    }
                />
                <div className="grid grid-cols-1 gap-5 px-5 py-10 md:grid-cols-2 md:px-8 lg:grid-cols-3 xl:px-20">
                    {mascotArtPackages?.map((artPackage, indx) => (
                        <motion.div
                            whileInView={{ y: 0, x: 0, scale: 1, opacity: 1 }}
                            initial={{ y: 50, x: 50, scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.95, delay: 0.2 + indx / 10, type: 'spring' }}
                        >
                            <DynamicArtPackageCard key={artPackage.id} artPackage={artPackage} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
