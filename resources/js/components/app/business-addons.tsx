import { BusinessPackageAddonT } from '@/types';

export default function BusinessAddons({ businessPackageAddons }: { businessPackageAddons: BusinessPackageAddonT[] }) {
    if (!businessPackageAddons || businessPackageAddons?.length === 0) return null;

    return (
        <table className="block w-full">
            <thead className="block w-full">
                <tr className="block space-x-3">
                    <th className="inline-block w-[55%] rounded-2xl bg-black p-3 font-bold text-white uppercase">Item Name</th>
                    <th className="inline-block w-[42%] rounded-2xl bg-black p-3 font-bold text-white uppercase">Cost in USD</th>
                </tr>
            </thead>
            <tbody className="block">
                {businessPackageAddons.map((addon) => (
                    <tr key={addon?.id} className="my-2 block w-full space-x-3">
                        <td className="inline-block w-[55%] rounded-2xl bg-gray-100 p-3 text-start font-bold text-black">{addon?.name}</td>
                        <td className="inline-block w-[42%] rounded-2xl bg-gray-100 p-3 text-end font-bold text-black">
                            {addon?.price_text} {addon?.currency}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
