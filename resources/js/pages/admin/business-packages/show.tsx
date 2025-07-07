import { Head, Link } from '@inertiajs/react';

import ColorTag from '@/components/app/color-tag';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BusinessPackageT } from '@/types';
import {
    ArrowLeft,
    Calendar,
    Check,
    CircleDollarSign,
    Clock,
    Edit,
    NotepadTextDashed,
    Package,
    PaintBucket,
    SquareStack,
    StickyNote,
    Tag,
} from 'lucide-react';

interface BusinessPackageWithStrategyT extends BusinessPackageT {
    brand_strategy?: {
        id: number;
        title: string;
    };
}

interface ShowBusinessPackageProps {
    businessPackage: BusinessPackageWithStrategyT;
}

function renderDetailLink(item: unknown, colorClass: string) {
    if (
        item &&
        typeof item === 'object' &&
        'detail_link' in item &&
        typeof (item as Record<string, unknown>).detail_link === 'string' &&
        (item as Record<string, unknown>).detail_link
    ) {
        return (
            <a
                href={(item as Record<string, unknown>).detail_link as string}
                target="_blank"
                rel="noopener noreferrer"
                className={`ml-1 ${colorClass} hover:underline`}
                title="View detail"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" />
                </svg>
            </a>
        );
    }
    return null;
}

export default function ShowBusinessPackage({ businessPackage }: ShowBusinessPackageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Business Packages',
            href: '/admin/business-packages',
        },
        {
            title: businessPackage?.name,
            href: `/admin/business-packages/${businessPackage.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={businessPackage.name} />

            <div className="container px-3 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('business-packages.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="flex flex-col gap-2 text-2xl font-bold md:flex-row md:items-center">
                            <span>{businessPackage?.name}</span>
                            {!!businessPackage?.is_recommended && <Badge>Recommended</Badge>}
                            {!!businessPackage?.is_discount && <Badge variant="destructive">Discount Active</Badge>}
                        </h1>
                    </div>
                    <Link href={route('business-packages.edit', businessPackage?.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Package
                        </Button>
                    </Link>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <fieldset className="col-span-2 grid w-full grid-cols-1 gap-8 rounded-lg border p-5 transition-all duration-500 hover:shadow-lg lg:grid-cols-2">
                            <legend className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-500">
                                <Package className="size-3.5" /> <span>Package Details</span>
                            </legend>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <NotepadTextDashed className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Description</span>
                                </div>
                                <p>{businessPackage?.description}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <CircleDollarSign className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Price</span>
                                </div>
                                <p>
                                    {businessPackage?.price_text} {businessPackage?.currency}
                                    {businessPackage?.price && <span className="ml-2 text-sm text-gray-500">(${businessPackage.price})</span>}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <PaintBucket className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Color</span>
                                </div>
                                <ColorTag color={businessPackage?.color} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <Tag className="size-3.5" />
                                    <span className="text-sm font-semibold text-gray-500">Status</span>
                                </div>
                                <div className="flex gap-2">
                                    {businessPackage?.is_recommended && <Badge variant="default">Recommended</Badge>}
                                    {businessPackage?.is_discount && <Badge variant="destructive">Discount Active</Badge>}
                                </div>
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <div className="mb-1 flex items-center gap-2">
                                    <SquareStack className="size-4 text-blue-500" />
                                    <span className="text-sm font-semibold text-gray-700">Guideline & Strategy</span>
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row md:gap-6">
                                    <div className="flex items-center gap-2">
                                        <NotepadTextDashed className="size-4 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-500">Brand Guideline:</span>
                                        {businessPackage?.brand_guideline ? (
                                            <Link
                                                href={route('business-brand-guidelines.show', businessPackage.brand_guideline.id)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {businessPackage.brand_guideline.title}
                                            </Link>
                                        ) : (
                                            <span className="text-sm text-gray-400">None</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <NotepadTextDashed className="size-4 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-500">Brand Strategy:</span>
                                        {businessPackage?.brand_strategy ? (
                                            <Link
                                                href={route('brand-strategies.show', businessPackage.brand_strategy.id)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {businessPackage.brand_strategy.title}
                                            </Link>
                                        ) : (
                                            <span className="text-sm text-gray-400">None</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {businessPackage?.is_discount && (
                            <fieldset className="col-span-2 grid w-full grid-cols-1 gap-8 rounded-lg border p-5 transition-all duration-500 hover:shadow-lg lg:grid-cols-2">
                                <legend className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-500">
                                    <Tag className="size-3.5" /> <span>Discount Information</span>
                                </legend>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1">
                                        <CircleDollarSign className="size-3.5" />
                                        <span className="text-sm font-semibold text-gray-500">Discount Price</span>
                                    </div>
                                    <p className="font-semibold text-red-600">{businessPackage?.discount_price_text}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="size-3.5" />
                                        <span className="text-sm font-semibold text-gray-500">Discount End Date</span>
                                    </div>
                                    <p>
                                        {businessPackage?.discount_end_date
                                            ? new Date(businessPackage.discount_end_date).toLocaleDateString()
                                            : 'No end date'}
                                    </p>
                                </div>
                                {businessPackage?.discount_description && (
                                    <div className="space-y-2 md:col-span-2">
                                        <div className="flex items-center gap-1">
                                            <StickyNote className="size-3.5" />
                                            <span className="text-sm font-semibold text-gray-500">Discount Description</span>
                                        </div>
                                        <p>{businessPackage.discount_description}</p>
                                    </div>
                                )}
                            </fieldset>
                        )}

                        <fieldset className="col-span-2 space-y-2 rounded-lg border p-5">
                            <legend className="flex items-center gap-1">
                                <Clock className="size-3.5" />
                                <span className="text-sm font-semibold text-gray-500">Package Durations</span>
                            </legend>
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                {businessPackage?.durations?.map((duration) => (
                                    <div
                                        key={duration.id}
                                        className="mb-2 flex items-center gap-2 rounded-xl border p-2 shadow transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <Check className="size-4 stroke-3" />
                                        <div className="flex-1">
                                            <span className="font-medium">{duration.duration}</span>
                                            {duration.duration_remarks && <p className="text-sm text-gray-500">{duration.duration_remarks}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="col-span-2 space-y-2 rounded-lg border p-5">
                            <legend className="flex items-center gap-1">
                                <SquareStack className="size-3.5" />
                                <span className="text-sm font-semibold text-gray-500">Package Included Items</span>
                            </legend>
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                {businessPackage?.business_package_items?.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`mb-2 flex items-center gap-2 rounded-xl border p-2 shadow transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${!item.is_included ? 'bg-gray-50' : ''}`}
                                    >
                                        <Check className={`size-4 stroke-3 ${!item.is_included ? 'text-gray-400' : ''}`} />
                                        {item.is_included ? (
                                            <span className="flex items-center gap-2">
                                                {item.name}
                                                {renderDetailLink(item, 'text-blue-500 hover:text-blue-700')}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-gray-400">
                                                <del>{item.name}</del>
                                                {renderDetailLink(item, 'text-blue-400 hover:text-blue-600')}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
