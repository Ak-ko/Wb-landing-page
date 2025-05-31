import { isLightColor } from '@/lib/colors';
import { BusinessPackageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';

export default function BusinessPlanSection() {
    const { businessPackages } = usePage<{ businessPackages: BusinessPackageT[] }>().props;

    if (!businessPackages || businessPackages?.length === 0) return null;

    return (
        <section className="py-16">
            <div className="app-container space-y-5 sm:px-11">
                {businessPackages?.map((b) => (
                    <div key={b?.id} className="rounded-xl bg-black text-white">
                        <div className="space-y-1.5 p-8">
                            <h1 className="text-center text-3xl font-bold uppercase md:text-start" style={{ color: b?.color }}>
                                {b?.name}
                            </h1>
                            <p className="text-center uppercase md:text-start">{b?.description}</p>
                        </div>
                        <ul className="grid grid-cols-1 gap-3 p-8 md:grid-cols-2">
                            {b?.all_items?.map((i) =>
                                i?.is_included ? (
                                    <li key={i?.id} className="flex items-center gap-2 font-bold uppercase">
                                        <Check
                                            style={{
                                                color: b?.color,
                                            }}
                                        />
                                        <span>{i?.name}</span>
                                    </li>
                                ) : (
                                    <li key={i?.id} className="flex items-center gap-2 font-bold text-white/50 uppercase line-through">
                                        <Check
                                            style={{
                                                color: b?.color,
                                            }}
                                        />
                                        <span>{i?.name}</span>
                                    </li>
                                ),
                            )}
                        </ul>
                        <div style={{ backgroundColor: b?.color }}>
                            <div className="flex flex-col justify-between gap-5 py-8 md:flex-row md:items-center md:gap-0 md:px-5 lg:px-8">
                                <div>
                                    <h1 style={{ color: isLightColor(b?.color) ? '#000' : '#fff' }} className="text-3xl font-bold">
                                        {b?.price_text} {b?.currency}
                                    </h1>
                                </div>
                                <div style={{ color: isLightColor(b?.color) ? '#000' : '#fff' }} className="text-lg font-bold uppercase">
                                    <h1>Duration: __________________ {b?.duration}</h1>
                                    <p>{b?.revision_remarks}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-between gap-5 p-8 md:flex-row md:gap-0">
                            <button className="cursor-pointer rounded-lg bg-white px-8 py-3 font-bold text-black transition-all duration-500 hover:shadow-lg hover:shadow-white/80">
                                Get This Package
                            </button>
                            <button className="cursor-pointer text-2xl font-bold text-white/50 transition-all duration-500 hover:text-white">
                                Brand Guideline {'>>'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
