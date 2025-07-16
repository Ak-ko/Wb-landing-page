import { BusinessPackageAddonT } from '@/types';
import { motion } from 'framer-motion';

export default function BusinessAddons({ businessPackageAddons }: { businessPackageAddons: BusinessPackageAddonT[] }) {
    if (!businessPackageAddons || businessPackageAddons?.length === 0) return null;
    return (
        <table className="block w-full overflow-hidden">
            <thead className="block w-full">
                <tr className="block space-x-3">
                    <th className="inline-block w-[48%] rounded-2xl bg-black p-3 font-bold text-white uppercase sm:w-[55%]">Item Name</th>
                    <th className="inline-block w-[48%] rounded-2xl bg-black p-3 font-bold text-white uppercase sm:w-[42%]">Cost in USD</th>
                </tr>
            </thead>
            <tbody className="block">
                {businessPackageAddons.map((addon, indx) => (
                    <motion.tr
                        whileInView={{ y: 0, x: 0, scale: 1, opacity: 1 }}
                        initial={{ y: 50, x: 50, scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.95, delay: 0.2 + indx / 10, type: 'spring' }}
                        key={addon?.id}
                        className="my-2 block w-full space-x-1 lg:space-x-3"
                    >
                        <td className="inline-block w-[48%] rounded-2xl bg-gray-100 px-4 py-3 text-start text-sm font-bold text-black sm:w-[55%] lg:px-5 lg:text-base">
                            {addon?.name}
                        </td>
                        <td className="inline-block w-[48%] rounded-2xl bg-gray-100 px-4 py-3 text-end text-sm font-bold text-black sm:w-[42%] lg:px-5 lg:text-base">
                            {addon?.price_text} {addon?.currency}
                        </td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    );
}
