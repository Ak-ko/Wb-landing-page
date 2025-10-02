import { BusinessPackageAddonT } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

import BusinessAddons from './business-addons';
import SectionHeader from './section-header';

export default function BusinessAddonOptions() {
    const { businessPackageAddons } = usePage<{ businessPackageAddons: BusinessPackageAddonT[] }>().props;

    if (!businessPackageAddons || businessPackageAddons?.length === 0) return null;

    const firstHalfAddons = businessPackageAddons.slice(0, Math.ceil(businessPackageAddons.length / 2));
    const secondHalfAddons = businessPackageAddons.slice(Math.ceil(businessPackageAddons.length / 2));

    return (
        <section className="py-16">
            <div className="app-container 3xl:px-[400px] space-y-5 sm:px-11">
                <SectionHeader header="Add-On Options" />

                <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
                    <BusinessAddons businessPackageAddons={firstHalfAddons} />
                    <div>
                        <BusinessAddons businessPackageAddons={secondHalfAddons} />
                        <motion.div
                            whileInView={{ scaleX: 1 }}
                            initial={{ scaleX: 0 }}
                            transition={{ duration: 0.5, delay: 1, ease: 'easeInOut' }}
                            viewport={{ once: true }}
                            className="w-full origin-left rounded-2xl bg-gray-100 p-3 text-center font-bold text-black"
                        >
                            <h1 className="uppercase">All designs have 2 rounds of revision.</h1>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
