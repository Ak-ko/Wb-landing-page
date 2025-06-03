// ... existing code ...
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BusinessBrandGuidelineT } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface ShowProps {
    guideline: BusinessBrandGuidelineT;
}

export default function ShowBusinessBrandGuideline({ guideline }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Business Brand Guidelines', href: '/admin/business-brand-guidelines' },
        { title: 'Show', href: `/admin/business-brand-guidelines/${guideline.id}` },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={guideline.title} />
            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <DashboardTitle title={guideline.title} />

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => router.get('/admin/business-brand-guidelines')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Back to Brand Guidelines</span>
                            <span className="sm:hidden">Back</span>
                        </Button>
                        <Button onClick={() => router.get(route('business-brand-guidelines.edit', guideline.id))}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Edit Brand Guideline</span>
                            <span className="sm:hidden">Edit</span>
                        </Button>
                    </div>
                </div>

                <div className="rounded border p-4 shadow">
                    <div className="mb-2 text-lg font-semibold">{guideline.title}</div>
                    <div className="text-muted-foreground mb-4">{guideline.description}</div>
                    <div>
                        <h3 className="mb-2 font-semibold">Elements</h3>
                        {guideline.elements?.length ? (
                            <ul className="space-y-2">
                                {guideline.elements.map((element) => (
                                    <li key={element.id} className="rounded border p-4">
                                        <div className="font-medium">{element.title}</div>
                                        <div className="text-muted-foreground text-xs">Order: {element.order ?? '-'}</div>
                                        <div className="mt-1">
                                            <strong>Items:</strong>
                                            <ul className="ml-5 list-disc">
                                                {element.items?.map((item) => (
                                                    <li key={item.id}>
                                                        {item.title}{' '}
                                                        <span className="text-muted-foreground text-xs">(Order: {item.order ?? '-'})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-muted-foreground">No elements.</div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
