import { isLightColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { BusinessPackageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';

// Types for extra fields from backend
interface BrandElementItem {
    id: number | string;
    order: number;
    title: string;
}
interface BrandElement {
    id: number | string;
    order: number;
    title: string;
    items?: BrandElementItem[];
}
interface BrandStrategyOrGuideline {
    title?: string;
    description?: string;
    elements?: BrandElement[];
}

const PANELS = [
    { key: 'main', label: 'Brand Package' },
    { key: 'strategy', label: 'Brand Strategy' },
    { key: 'guideline', label: 'Brand Guidelines' },
] as const;
type PanelKey = (typeof PANELS)[number]['key'];

// Helper to chunk array into rows
function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

export default function BusinessPlanSection() {
    const { businessPackages } = usePage<{ businessPackages: BusinessPackageT[] }>().props;
    const [activePanel, setActivePanel] = useState<PanelKey>('main');

    console.log(chunkArray(businessPackages[0]?.all_items ?? [], 3));

    if (!businessPackages || businessPackages.length === 0) return null;
    // Type assertion to allow extra fields from backend
    type ExtraFields = {
        brand_strategy?: BrandStrategyOrGuideline;
        brand_guideline?: BrandStrategyOrGuideline;
        all_items?: { id: number | string; name: string; is_included: boolean }[];
        normal_duration?: string;
        express_duration?: string;
    };
    const b = businessPackages[0] as BusinessPackageT & ExtraFields;
    const color = b?.color || '#00FF00';

    // Scrollbar style for desktop
    const scrollbarStyle = `scrollbar-thin scrollbar-thumb-[${color}] scrollbar-track-black`;

    // Price section helpers
    const hasDiscount = b.discount_price_text && b.discount_price_text !== b.price_text;

    return (
        <section className="hidden py-16 md:block">
            <div className="app-container mx-auto max-w-5xl">
                {/* Black Panel with fixed breadcrumb bar */}
                <div className="flex w-full flex-col overflow-hidden rounded-xl bg-black py-11" style={{ minHeight: 700 }}>
                    {/* Sliding Content Area */}
                    <div className="relative flex-1 overflow-hidden">
                        <motion.div
                            animate={{ x: activePanel === 'main' ? 0 : activePanel === 'strategy' ? '-100%' : '-200%' }}
                            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                            className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center p-8"
                            style={{ zIndex: 2 }}
                        >
                            <div className="mb-11 flex flex-col items-center justify-center">
                                <div className="mb-3 flex items-center gap-3 text-center text-3xl font-bold uppercase" style={{ color }}>
                                    <span>{b?.name}</span>
                                </div>
                                <p className="mb-3 max-w-2xl text-center text-sm text-white/80 uppercase">{b?.description}</p>{' '}
                                {b?.is_recommended && (
                                    <span
                                        className="ml-2 rounded-full px-3 py-2 text-xs uppercase"
                                        style={{
                                            background: color,
                                            color: isLightColor(color) ? 'black' : 'white',
                                        }}
                                    >
                                        Recommended
                                    </span>
                                )}
                            </div>
                            <div className={cn('w-full flex-1 overflow-y-auto', scrollbarStyle)} style={{ maxHeight: 300 }}>
                                <ul className={cn('grid w-full grid-cols-3 gap-3 px-4 pr-1')}>
                                    {b?.all_items?.map((i, idx) => (
                                        <li
                                            key={i?.id}
                                            className={cn(
                                                'flex items-center space-x-1 self-start text-sm uppercase',
                                                i?.is_included ? 'text-white' : 'text-white/50 line-through',
                                                idx < 4 ? 'font-bold' : 'font-normal',
                                            )}
                                        >
                                            <Check style={{ color, width: 16, height: 16 }} />
                                            <span>{i?.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ x: activePanel === 'strategy' ? 0 : activePanel === 'guideline' ? '-100%' : '100%' }}
                            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                            className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center p-8"
                            style={{ zIndex: 2 }}
                        >
                            <div className="mb-5 flex flex-col items-center justify-center">
                                <div className="mb-3 flex items-center gap-3 text-center text-3xl font-bold uppercase" style={{ color }}>
                                    <span>{b?.brand_strategy?.title}</span>
                                </div>
                                <p className="mb-3 max-w-2xl text-center text-sm text-white/80 uppercase">{b?.brand_strategy?.description}</p>
                            </div>
                            <div className={cn('w-full flex-1 overflow-y-auto', scrollbarStyle)} style={{ maxHeight: 300 }}>
                                <ul className={cn('grid w-full grid-cols-3 gap-3 px-4 pr-1')}>
                                    {b?.brand_strategy?.elements?.map((i) => (
                                        <li key={i?.id}>
                                            <div className="flex items-center gap-2 text-xl font-bold text-white uppercase">
                                                <span>{i?.order}.</span>
                                                <span>{i?.title}</span>
                                            </div>
                                            <ul className="my-2 ml-5">
                                                {i?.items?.map((j) => (
                                                    <li key={j?.id} className="flex items-center gap-2 text-white uppercase">
                                                        <span>{j?.order}.</span>
                                                        <span>{j?.title}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ x: activePanel === 'guideline' ? 0 : '100%' }}
                            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                            className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center p-8"
                            style={{ zIndex: 2 }}
                        >
                            <div className="mb-5 flex flex-col items-center justify-center">
                                <div className="mb-3 flex items-center gap-3 text-center text-3xl font-bold uppercase" style={{ color }}>
                                    <span>{b?.brand_guideline?.title}</span>
                                </div>
                                <p className="mb-3 max-w-2xl text-center text-sm text-white/80 uppercase">{b?.brand_guideline?.description}</p>
                            </div>
                            <div className={cn('w-full flex-1 overflow-y-auto', scrollbarStyle)} style={{ maxHeight: 300 }}>
                                <ul className={cn('grid w-full grid-cols-3 gap-3 px-4 pr-1')}>
                                    {b?.brand_guideline?.elements?.map((i) => (
                                        <li key={i?.id}>
                                            <div className="flex items-center gap-2 text-xl font-bold text-white uppercase">
                                                <span>{i?.order}.</span>
                                                <span>{i?.title}</span>
                                            </div>
                                            <ul className="my-2 ml-5">
                                                {i?.items?.map((j) => (
                                                    <li key={j?.id} className="flex items-center gap-2 text-white uppercase">
                                                        <span>{j?.order}.</span>
                                                        <span>{j?.title}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                    {/* Breadcrumb Bar (near bottom, with colored borders) */}
                    <div
                        className="mx-auto mb-11 flex h-16 w-[88%] items-center justify-center"
                        style={{
                            borderTop: `2px solid ${color}`,
                            borderBottom: `2px solid ${color}`,
                            background: 'black',
                        }}
                    >
                        {PANELS.map((panel, idx) => (
                            <>
                                <button
                                    key={panel.key}
                                    onClick={() => setActivePanel(panel.key)}
                                    className={cn(
                                        'px-6 py-2 text-base font-bold uppercase transition-all',
                                        activePanel === panel.key ? 'text-white' : 'text-white/50',
                                        'focus:outline-none',
                                    )}
                                >
                                    {panel.label}
                                </button>
                                {idx < PANELS.length - 1 && <span className="text-lg text-white/30">&gt;</span>}
                            </>
                        ))}
                    </div>
                </div>
                {/* Price Section */}
                <div className="flex flex-col items-center bg-white py-22 text-center">
                    <div className="mb-5">
                        <div className="mb-2 text-4xl font-bold uppercase" style={{ color }}>
                            {b?.name}
                        </div>
                        <div className="mb-1 text-base text-black/80">for an investment of just</div>
                    </div>
                    {hasDiscount && (
                        <div className="mb-5">
                            {b.discount_description && <div className="text-primary-orange text-2xl font-semibold">{b.discount_description}</div>}
                            <div className="mb-1 text-xl line-through" style={{ textDecorationColor: 'var(--color-primary-orange, #FFA500)' }}>
                                {b.price_text}
                            </div>
                        </div>
                    )}
                    <div className="mb-5 text-3xl font-bold text-black">{hasDiscount ? b.discount_price_text : b.price_text}</div>
                    <div className="mb-3 space-y-1 text-lg text-black/80">
                        {b?.durations?.map((d) => (
                            <div key={d?.id}>
                                <span>
                                    <span className="font-bold">{d?.duration_remarks?.split(' ')[0]} </span>
                                    <span>{d?.duration_remarks?.split(' ').slice(1).join(' ')}</span>
                                </span>{' '}
                                &rarr; {d?.duration}
                            </div>
                        ))}
                    </div>
                    <a
                        href="#get-this-package"
                        className="mt-4 rounded-lg bg-[#00b050] px-8 py-3 font-bold text-white uppercase transition-all duration-300 hover:bg-[#009940]"
                        style={{ minWidth: 180 }}
                    >
                        Get This Package
                    </a>
                </div>
            </div>
        </section>
    );
}
