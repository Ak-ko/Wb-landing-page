import { isLightColor } from '@/lib/colors';
import { MESSENGER } from '@/lib/social-links';
import { cn } from '@/lib/utils';
import { BusinessPackageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { Check, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';

export default function BusinessPlanSection() {
    const { businessPackages } = usePage<{ businessPackages: BusinessPackageT[] }>().props;

    const [brandGuidelineActive, setBrandGuidelineActive] = useState<boolean | null>(null);

    if (!businessPackages || businessPackages?.length === 0) return null;

    return (
        <section className="py-16">
            <div className="app-container space-y-5 sm:px-11">
                {businessPackages?.map((b) => (
                    <div className="relative w-full overflow-hidden rounded-xl">
                        <div
                            key={b?.id}
                            className={cn(
                                'w-full bg-black text-white transition-all duration-500',
                                !brandGuidelineActive ? 'translate-x-0' : '-translate-x-full',
                            )}
                        >
                            <div className="space-y-1.5 p-8">
                                <h1
                                    className="flex items-center gap-3 text-center text-3xl font-bold uppercase md:text-start"
                                    style={{ color: b?.color }}
                                >
                                    <span>{b?.name}</span>
                                    {b?.is_recommended && (
                                        <h1
                                            className="rounded-full px-3 py-2 text-xs"
                                            style={{
                                                background: `linear-gradient(to left, ${b?.color}, ${b?.color}50)`,
                                                color: isLightColor(b?.color) ? 'black' : 'white',
                                            }}
                                        >
                                            Recommanded
                                        </h1>
                                    )}
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
                            <div className="flex flex-col items-center justify-between gap-5 p-8 uppercase md:flex-row md:gap-0">
                                <a
                                    href={MESSENGER}
                                    target="_blank"
                                    className="cursor-pointer rounded-lg bg-white px-8 py-3 font-bold text-black uppercase transition-all duration-500 hover:shadow-lg hover:shadow-white/80"
                                >
                                    Get This Package
                                </a>
                                <button
                                    onClick={() => {
                                        setBrandGuidelineActive(true);
                                    }}
                                    className="flex cursor-pointer items-center gap-2 text-2xl font-bold text-white/50 uppercase transition-all duration-500 hover:text-white"
                                >
                                    <span>Brand Guideline</span> <ChevronsRight className="size-[30px]" />
                                </button>
                            </div>
                        </div>

                        <div
                            className={cn(
                                'absolute top-0 z-[2] h-full w-full bg-black text-white transition-all duration-500',
                                brandGuidelineActive ? 'right-0' : 'right-[-100%]',
                            )}
                        >
                            <div className="space-y-1.5 p-8">
                                <h1 className="text-center text-3xl font-bold uppercase md:text-start" style={{ color: b?.color }}>
                                    {b?.brand_guideline?.title}
                                </h1>
                                <p className="text-center uppercase md:text-start">{b?.brand_guideline?.description}</p>
                            </div>
                            <ul className="grid max-h-[50%] grid-cols-1 gap-3 overflow-y-auto p-8 md:grid-cols-2">
                                {b?.brand_guideline?.elements?.map((i) => (
                                    <li key={i?.id}>
                                        <div className="flex items-center gap-2 text-xl font-bold uppercase">
                                            <span>{i?.order}.</span>
                                            <span>{i?.title}</span>
                                        </div>

                                        <ul className="my-2 ml-5">
                                            {i?.items?.map((j) => (
                                                <li className="flex items-center gap-2 uppercase">
                                                    <span>{j?.order}.</span>
                                                    <span>{j?.title}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col items-center justify-between gap-5 p-8 uppercase md:flex-row md:gap-0">
                                <a
                                    href={MESSENGER}
                                    target="_blank"
                                    className="cursor-pointer rounded-lg bg-white px-8 py-3 font-bold text-black uppercase transition-all duration-500 hover:shadow-lg hover:shadow-white/80"
                                >
                                    Get This Package
                                </a>
                                <button
                                    onClick={() => {
                                        setBrandGuidelineActive(false);
                                    }}
                                    className="flex cursor-pointer items-center gap-2 text-2xl font-bold text-white/50 uppercase transition-all duration-500 hover:text-white"
                                >
                                    <span>Brand Guideline</span> <ChevronsLeft className="size-[30px]" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
