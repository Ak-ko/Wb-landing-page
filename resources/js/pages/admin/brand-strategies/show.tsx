import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BrandStrategyT, BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, List, NotepadTextDashed } from 'lucide-react';

interface ShowBrandStrategyProps {
    strategy: BrandStrategyT;
}

export default function ShowBrandStrategy({ strategy }: ShowBrandStrategyProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Brand Strategies',
            href: '/admin/brand-strategies',
        },
        {
            title: strategy?.title,
            href: `/admin/brand-strategies/${strategy.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={strategy.title} />
            <div className="container px-3 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('brand-strategies.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="flex flex-col gap-2 text-2xl font-bold md:flex-row md:items-center">
                            <span>{strategy?.title}</span>
                        </h1>
                    </div>
                    <Link href={route('brand-strategies.edit', strategy?.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Strategy
                        </Button>
                    </Link>
                </div>
                <div className="p-5">
                    <fieldset className="mb-8 rounded-lg border p-5">
                        <legend className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-500">
                            <NotepadTextDashed className="size-3.5" /> <span>Strategy Details</span>
                        </legend>
                        <div className="mb-2">
                            <span className="text-sm font-semibold text-gray-500">Description:</span>
                            <p>{strategy?.description || <span className="text-gray-400">No description</span>}</p>
                        </div>
                    </fieldset>
                    <fieldset className="rounded-lg border p-5">
                        <legend className="flex items-center gap-1">
                            <List className="size-3.5" />
                            <span className="text-sm font-semibold text-gray-500">Strategy Subtitles</span>
                        </legend>
                        <div className="mt-4 space-y-6">
                            {strategy?.elements?.map((element) => (
                                <div key={element.id} className="rounded-lg border p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="font-semibold">{element.title}</span>
                                        {element.order !== null && <Badge variant="secondary">Order: {element.order}</Badge>}
                                    </div>
                                    <ul className="ml-4 list-disc space-y-1">
                                        {element.items?.map((item) => (
                                            <li key={item.id} className="flex items-center gap-2">
                                                <span>{item.title}</span>
                                                {item.order !== null && <span className="text-xs text-gray-400">(Order: {item.order})</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </fieldset>
                </div>
            </div>
        </AppLayout>
    );
}
