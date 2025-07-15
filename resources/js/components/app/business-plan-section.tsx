import { isLightColor } from '@/lib/colors';
import { MESSENGER } from '@/lib/social-links';
import { cn } from '@/lib/utils';
import { BusinessPackageT } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion as framerMotion, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import React, { useState } from 'react';

interface BrandElementItem {
    id: number | string;
    order: number | null;
    title: string;
}
interface BrandElement {
    id: number | string;
    order: number | null;
    title: string;
    items?: BrandElementItem[];
}
interface BrandStrategyOrGuideline {
    title?: string | null;
    description?: string | null;
    elements?: BrandElement[];
}
interface Duration {
    id: number | string;
    duration: string;
    duration_remarks: string | null;
}
interface AllItem {
    id: number | string;
    name: string;
    is_included: boolean;
    detail_link?: string;
}

const PANELS = [
    { key: 'main', label: 'Brand Package' },
    { key: 'strategy', label: 'Brand Strategy' },
    { key: 'guideline', label: 'Brand Guidelines' },
] as const;
type PanelKey = (typeof PANELS)[number]['key'];

// BreadcrumbBar
function BreadcrumbBar({ color, activePanel, setPanel }: { color: string; activePanel: PanelKey; setPanel: (panel: PanelKey) => void }) {
    return (
        <div
            className="mx-auto mb-11 flex h-16 w-[88%] items-center justify-center"
            style={{ borderTop: `2px solid ${color}`, borderBottom: `2px solid ${color}`, background: 'black' }}
        >
            {PANELS.map((panel, idx) => (
                <React.Fragment key={panel.key}>
                    <button
                        onClick={() => setPanel(panel.key as PanelKey)}
                        className={cn(
                            'px-6 py-2 text-base font-bold uppercase transition-all',
                            activePanel === panel.key ? 'text-white' : 'text-white/50',
                            'focus:outline-none',
                        )}
                    >
                        {panel.label}
                    </button>
                    {idx < PANELS.length - 1 && <span className="text-lg text-white/30">&gt;</span>}
                </React.Fragment>
            ))}
        </div>
    );
}

// PackagePanelContent
function PackagePanelContent({
    b,
    color,
    scrollbarStyle,
}: {
    b: BusinessPackageT & {
        brand_strategy?: BrandStrategyOrGuideline;
        brand_guideline?: BrandStrategyOrGuideline;
        durations?: Duration[];
        all_items?: AllItem[];
    };
    color: string;
    scrollbarStyle: string;
}) {
    return (
        <div className="mb-11">
            <div className="mb-11 flex flex-col items-center justify-center">
                <div className="mb-3 flex items-center gap-3 text-center text-3xl font-bold uppercase" style={{ color }}>
                    <span>{b?.name}</span>
                </div>
                <p className="mb-3 max-w-2xl text-center text-sm text-white/80 uppercase">{b?.description}</p>
                {b?.is_recommended && (
                    <span
                        className="ml-2 rounded-full px-3 py-2 text-xs uppercase"
                        style={{ background: color, color: isLightColor(color) ? 'black' : 'white' }}
                    >
                        Recommended
                    </span>
                )}
            </div>
            <div className={cn('w-full flex-1 overflow-y-auto', scrollbarStyle)} style={{ maxHeight: 300 }}>
                <ul className={cn('grid w-full grid-cols-3 gap-3 px-4 pr-1')}>
                    {b?.all_items?.map((i: AllItem, idx: number) => (
                        <li
                            key={i?.id}
                            className={cn(
                                'flex items-center space-x-1 self-start text-sm uppercase',
                                i?.is_included ? 'text-white' : 'text-white/50 line-through',
                                idx < 4 ? 'font-bold' : 'font-normal',
                            )}
                        >
                            <Check style={{ color }} />
                            <div className="flex w-full items-start gap-0.5">
                                <span className="w-[74%] text-wrap">{i?.name}</span>
                                {i?.detail_link && (
                                    <a
                                        href={i?.detail_link}
                                        target="_blank"
                                        className="inline-block w-[30%] text-xs font-normal text-nowrap text-white capitalize underline"
                                    >
                                        See Detail
                                    </a>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// StrategyPanelContent
function StrategyPanelContent({
    b,
    color,
    scrollbarStyle,
}: {
    b: BusinessPackageT & {
        brand_strategy?: BrandStrategyOrGuideline;
        brand_guideline?: BrandStrategyOrGuideline;
        durations?: Duration[];
        all_items?: AllItem[];
    };
    color: string;
    scrollbarStyle: string;
}) {
    return (
        <div className="mb-11">
            <div className="mb-11 flex flex-col items-center justify-center">
                <div className="mb-3 flex items-center gap-3 text-center text-3xl font-bold uppercase" style={{ color }}>
                    <span>{b?.brand_strategy?.title}</span>
                </div>
                <p className="mb-3 max-w-2xl text-center text-sm text-white/80 uppercase">{b?.brand_strategy?.description}</p>
            </div>
            <div className={cn('w-full flex-1 overflow-y-auto', scrollbarStyle)} style={{ maxHeight: 300 }}>
                <ul className={cn('grid w-full grid-cols-2 gap-13 px-4 pr-1')}>
                    {b?.brand_strategy?.elements?.map((i: BrandElement) => (
                        <li key={i?.id}>
                            <div className="flex w-full items-center gap-3 text-xl font-bold text-white uppercase">
                                <span>{i?.order}</span>
                                <span>{i?.title}</span>
                            </div>
                            <ul className="my-2">
                                {i?.items?.map((j: BrandElementItem, subIdx: number) => (
                                    <li key={j?.id} className="flex items-center gap-3 text-white uppercase">
                                        <span>{j?.order}.</span>
                                        <span className="flex min-w-0 flex-1 items-center">
                                            <span className="truncate">{j?.title}</span>
                                            <span className="mx-2 flex-1 overflow-hidden whitespace-nowrap text-white" style={{ letterSpacing: 2 }}>
                                                {'.'.repeat(100)}
                                            </span>
                                            <span className="text-base text-white">{String(subIdx + 1).padStart(2, '0')}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// GuidelinePanelContent
function GuidelinePanelContent({
    b,
    color,
    scrollbarStyle,
}: {
    b: BusinessPackageT & {
        brand_strategy?: BrandStrategyOrGuideline;
        brand_guideline?: BrandStrategyOrGuideline;
        durations?: Duration[];
        all_items?: AllItem[];
    };
    color: string;
    scrollbarStyle: string;
}) {
    return (
        <div className="mb-11">
            <div className="mb-11 flex flex-col items-center justify-center">
                <div className="mb-3 flex items-center gap-3 text-center text-3xl font-bold uppercase" style={{ color }}>
                    <span>{b?.brand_guideline?.title}</span>
                </div>
                <p className="mb-3 max-w-2xl text-center text-sm text-white/80 uppercase">{b?.brand_guideline?.description}</p>
            </div>
            <div className={cn('w-full flex-1 overflow-y-auto', scrollbarStyle)} style={{ maxHeight: 300 }}>
                <ul className={cn('grid w-full grid-cols-2 gap-13 px-4 pr-1')}>
                    {b?.brand_guideline?.elements?.map((i: BrandElement) => (
                        <li key={i?.id}>
                            <div className="flex w-full items-center gap-3 text-xl font-bold text-white uppercase">
                                <span>{i?.order}</span>
                                <span>{i?.title}</span>
                            </div>
                            <ul className="my-2">
                                {i?.items?.map((j: BrandElementItem, subIdx: number) => (
                                    <li key={j?.id} className="flex items-center gap-3 text-white uppercase">
                                        <span>{j?.order}.</span>
                                        <span className="flex min-w-0 flex-1 items-center">
                                            <span className="truncate">{j?.title}</span>
                                            <span className="mx-2 flex-1 overflow-hidden whitespace-nowrap text-white" style={{ letterSpacing: 2 }}>
                                                {'.'.repeat(100)}
                                            </span>
                                            <span className="text-base text-white">{String(subIdx + 1).padStart(2, '0')}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// PriceSection
function PriceSection({
    b,
    color,
    hasDiscount,
}: {
    b: BusinessPackageT & {
        brand_strategy?: BrandStrategyOrGuideline;
        brand_guideline?: BrandStrategyOrGuideline;
        durations?: Duration[];
        all_items?: AllItem[];
    };
    color: string;
    hasDiscount: boolean;
}) {
    return (
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
                {b?.durations?.map((d: Duration) => (
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
                href={MESSENGER}
                target="_blank"
                className="mt-4 rounded-lg px-8 py-3 font-bold text-white uppercase transition-all duration-300"
                style={{ minWidth: 180, background: color, color: isLightColor(color) ? 'black' : 'white' }}
            >
                Get This Package
            </a>
        </div>
    );
}

// Mobile Card Component
function BusinessPackageCard({ b, color, onClick }: { b: BusinessPackageT & { all_items?: AllItem[] }; color: string; onClick: () => void }) {
    return (
        <div className="relative mb-6 overflow-hidden rounded-2xl p-5" style={{ background: color }}>
            <div>
                <img src="/assets/logo.png" className="absolute top-1/2 right-[-15%] size-[150px] -translate-y-1/2 opacity-[15%]" />
            </div>
            <div className="relative z-[2] mb-2 flex items-center justify-between">
                <div className="text-xl font-bold text-white uppercase">{b.name}</div>
                {b.is_recommended && (
                    <span className="ml-2 rounded-full border border-white px-2 py-1 text-xs font-bold text-white uppercase">Recommended</span>
                )}
            </div>
            <ul className="relative z-[2] mb-4 space-y-1">
                {b.all_items?.slice(0, 4).map((i) => (
                    <li key={i.id} className="flex items-center text-sm text-white">
                        <Check style={{ color: 'white', width: 18, height: 18 }} />
                        <span className="ml-2">{i.name}</span>
                    </li>
                ))}
            </ul>
            <button className="relative z-[2] mt-2 w-full rounded-full bg-black py-3 text-base font-bold text-white uppercase" onClick={onClick}>
                Explore Package
            </button>
        </div>
    );
}

// Mobile Detail View
function MobileBusinessPackageDetail({
    b,
    color,
    onBack,
}: {
    b: BusinessPackageT & {
        brand_strategy?: BrandStrategyOrGuideline;
        brand_guideline?: BrandStrategyOrGuideline;
        durations?: Duration[];
        all_items?: AllItem[];
    };
    color: string;
    onBack: () => void;
}) {
    const [activePanel, setActivePanel] = useState<PanelKey>('main');
    const scrollbarStyle = `scrollbar-thin scrollbar-thumb-[${color}] scrollbar-track-black`;
    const hasDiscount = b.is_discount;
    return (
        <framerMotion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-black"
        >
            <div className="flex items-center p-4">
                <button onClick={onBack} className="mr-2 text-lg font-bold text-white">
                    ←
                </button>
                <span className="text-lg font-bold text-white">{b.name}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24">
                {activePanel === 'main' && (
                    <div className="mb-8 flex flex-col items-center">
                        <div className="mb-2 text-2xl font-bold uppercase" style={{ color }}>
                            {b.name}
                        </div>
                        <p className="mb-4 text-center text-sm text-white/80 uppercase">{b.description}</p>
                        <ul className={cn('grid w-full flex-1 grid-cols-1 gap-2', scrollbarStyle)} style={{ maxHeight: 300 }}>
                            {b.all_items?.map((i: AllItem, idx: number) => (
                                <li
                                    key={i.id}
                                    className={cn(
                                        'flex items-center space-x-1 text-base uppercase',
                                        i.is_included ? 'text-white' : 'text-white/50 line-through',
                                        idx < 4 ? 'font-bold' : 'font-normal',
                                    )}
                                >
                                    <Check style={{ color }} />
                                    <div className="flex w-full items-start gap-0.5">
                                        <span className="w-[74%] text-wrap">{i.name}</span>
                                        {i?.detail_link && (
                                            <a
                                                href={i?.detail_link}
                                                target="_blank"
                                                className="inline-block w-[30%] text-sm font-normal text-nowrap text-white capitalize underline"
                                            >
                                                See Detail
                                            </a>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activePanel === 'strategy' && (
                    <div className="mb-8 flex flex-col items-center">
                        <div className="mb-2 text-2xl font-bold uppercase" style={{ color }}>
                            {b.brand_strategy?.title}
                        </div>
                        <p className="mb-4 text-center text-sm text-white/80 uppercase">{b.brand_strategy?.description}</p>
                        <ul className={cn('grid w-full flex-1 grid-cols-1 gap-2', scrollbarStyle)} style={{ maxHeight: 300 }}>
                            {b.brand_strategy?.elements?.map((i: BrandElement) => (
                                <li key={i.id}>
                                    <div className="flex items-center gap-2 text-lg font-bold text-white uppercase">
                                        <span>{i.order}</span>
                                        <span>{i.title}</span>
                                    </div>
                                    <ul className="my-2 ml-5">
                                        {i.items?.map((j: BrandElementItem) => (
                                            <li key={j.id} className="flex items-center gap-2 text-white uppercase">
                                                <span>{j.order}.</span>
                                                <span>{j.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activePanel === 'guideline' && (
                    <div className="mb-8 flex flex-col items-center">
                        <div className="mb-2 text-2xl font-bold uppercase" style={{ color }}>
                            {b.brand_guideline?.title}
                        </div>
                        <p className="mb-4 text-center text-sm text-white/80 uppercase">{b.brand_guideline?.description}</p>
                        <ul className={cn('grid w-full flex-1 grid-cols-1 gap-2', scrollbarStyle)} style={{ maxHeight: 300 }}>
                            {b.brand_guideline?.elements?.map((i: BrandElement) => (
                                <li key={i.id}>
                                    <div className="flex items-center gap-2 text-lg font-bold text-white uppercase">
                                        <span>{i.order}</span>
                                        <span>{i.title}</span>
                                    </div>
                                    <ul className="my-2 ml-5">
                                        {i.items?.map((j: BrandElementItem) => (
                                            <li key={j.id} className="flex items-center gap-2 text-white uppercase">
                                                <span>{j.order}.</span>
                                                <span>{j.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Price Section (mobile) */}
                <div className="mt-8 flex flex-col items-center rounded-xl bg-white py-8 text-center">
                    <div className="mb-2 text-2xl font-bold uppercase" style={{ color }}>
                        {b.name}
                    </div>
                    <div className="mb-1 text-base text-black/80">for an investment of just</div>
                    {hasDiscount && (
                        <div className="mb-3">
                            {b.discount_description && <div className="text-primary-orange text-lg font-semibold">{b.discount_description}</div>}
                            <div className="mb-1 text-lg line-through" style={{ textDecorationColor: 'var(--color-primary-orange, #FFA500)' }}>
                                {b.price_text}
                            </div>
                        </div>
                    )}
                    <div className="mb-3 text-2xl font-bold text-black">{hasDiscount ? b.discount_price_text : b.price_text}</div>
                    <div className="mb-2 space-y-1 text-base text-black/80">
                        {b?.durations?.map((d: Duration) => (
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
                        href={MESSENGER}
                        target="_blank"
                        className="mt-4 rounded-lg px-8 py-3 font-bold text-white uppercase transition-all duration-300"
                        style={{ minWidth: 180, background: color, color: isLightColor(color) ? 'black' : 'white' }}
                    >
                        Get This Package
                    </a>
                </div>
            </div>
            {/* Mobile Navigator */}
            <div className="fixed right-0 bottom-0 left-0 z-50 flex">
                {PANELS.map((panel) => (
                    <button
                        key={panel.key}
                        onClick={() => setActivePanel(panel.key as PanelKey)}
                        className={cn(
                            'flex flex-1 flex-col items-center justify-center px-1 py-2 text-xs font-bold uppercase transition-all',
                            activePanel === panel.key ? '' : 'bg-black text-white/60',
                        )}
                        style={
                            activePanel === panel.key
                                ? {
                                      background: color,
                                      color: isLightColor(color) ? 'black' : 'white',
                                  }
                                : undefined
                        }
                    >
                        <span>{panel.label.split(' ')[0]}</span>
                        <span className="mt-0.5 text-[10px] font-normal">{panel.label.split(' ').slice(1).join(' ')}</span>
                    </button>
                ))}
            </div>
        </framerMotion.div>
    );
}

export default function BusinessPlanSection() {
    const { businessPackages } = usePage<{ businessPackages: BusinessPackageT[] }>().props;
    const [activePanels, setActivePanels] = useState<{ [id: string]: PanelKey }>({});
    const [mobileDetailIdx, setMobileDetailIdx] = useState<number | null>(null);

    if (!businessPackages || businessPackages.length === 0) return null;

    const mobilePackages = businessPackages;

    return (
        <>
            {/* Mobile version */}
            <section className="block min-h-screen md:hidden">
                <div className="px-3 pt-6 pb-10">
                    <AnimatePresence>
                        {mobileDetailIdx === null ? (
                            <framerMotion.div
                                key="card-list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {mobilePackages.map((b) => (
                                    <BusinessPackageCard
                                        key={b.id}
                                        b={b}
                                        color={b.color}
                                        onClick={() => setMobileDetailIdx(mobilePackages.indexOf(b))}
                                    />
                                ))}
                            </framerMotion.div>
                        ) : (
                            <MobileBusinessPackageDetail
                                key={mobilePackages[mobileDetailIdx].id}
                                b={mobilePackages[mobileDetailIdx]}
                                color={mobilePackages[mobileDetailIdx].color}
                                onBack={() => setMobileDetailIdx(null)}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Desktop version */}
            <section className="hidden py-16 md:block">
                <div className="app-container mx-auto max-w-[1200px]">
                    {businessPackages.map((bRaw) => {
                        const b = bRaw as BusinessPackageT & {
                            brand_strategy?: BrandStrategyOrGuideline;
                            brand_guideline?: BrandStrategyOrGuideline;
                            durations?: Duration[];
                            all_items?: AllItem[];
                        };
                        const color = b?.color || '#00FF00';
                        const scrollbarStyle = `scrollbar-thin scrollbar-thumb-[${color}] scrollbar-track-black`;
                        const hasDiscount = b.is_discount;
                        const activePanel = activePanels[b.id] || 'main';
                        const setPanel = (panel: PanelKey) => setActivePanels((prev) => ({ ...prev, [b.id]: panel }));
                        return (
                            <div key={b.id} className="mb-16">
                                <div className="flex w-full flex-col overflow-hidden rounded-xl bg-black py-11" style={{ minHeight: 700 }}>
                                    <div className="relative flex-1 overflow-hidden">
                                        {/* Panels */}
                                        <motion.div
                                            animate={{ x: activePanel === 'main' ? 0 : activePanel === 'strategy' ? '-100%' : '-200%' }}
                                            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                                            className="absolute top-0 left-0 flex h-full w-full flex-col items-center px-8 pt-8"
                                            style={{ zIndex: 2 }}
                                        >
                                            <PackagePanelContent b={b} color={color} scrollbarStyle={scrollbarStyle} />
                                        </motion.div>
                                        <motion.div
                                            animate={{ x: activePanel === 'strategy' ? 0 : activePanel === 'guideline' ? '-100%' : '100%' }}
                                            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                                            className="absolute top-0 left-0 flex h-full w-full flex-col items-center px-8 pt-8"
                                            style={{ zIndex: 2 }}
                                        >
                                            <StrategyPanelContent b={b} color={color} scrollbarStyle={scrollbarStyle} />
                                        </motion.div>
                                        <motion.div
                                            animate={{ x: activePanel === 'guideline' ? 0 : '100%' }}
                                            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                                            className="absolute top-0 left-0 flex h-full w-full flex-col items-center px-8 pt-8"
                                            style={{ zIndex: 2 }}
                                        >
                                            <GuidelinePanelContent b={b} color={color} scrollbarStyle={scrollbarStyle} />
                                        </motion.div>
                                    </div>
                                    <BreadcrumbBar color={color} activePanel={activePanel} setPanel={setPanel} />
                                </div>
                                <PriceSection b={b} color={color} hasDiscount={hasDiscount} />
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
