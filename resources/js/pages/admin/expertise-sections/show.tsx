import { Head, Link } from '@inertiajs/react';

import DashboardTitle from '@/components/app/dashboard-title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Edit, List } from 'lucide-react';

interface ExpertiseSectionT {
    id: number;
    title: string;
    type: 'business' | 'established';
    plans: { text: string; order: number }[];
    color: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const breadcrumbs = (section: ExpertiseSectionT): BreadcrumbItem[] => [
    {
        title: 'Expertise Sections',
        href: '/admin/expertise-sections',
    },
    {
        title: section.title,
        href: `/admin/expertise-sections/${section.id}`,
    },
];

export default function ShowExpertiseSection({ expertiseSection }: { expertiseSection: ExpertiseSectionT }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(expertiseSection)}>
            <Head title={expertiseSection.title} />

            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <DashboardTitle title={expertiseSection.title} description="Expertise section details" />

                    <Button asChild>
                        <Link href={route('expertise-sections.edit', expertiseSection.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Section
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Section Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Title</label>
                                <p className="text-lg font-semibold">{expertiseSection.title}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Type</label>
                                <div className="mt-1">
                                    <Badge variant={expertiseSection.type === 'business' ? 'default' : 'secondary'}>
                                        {expertiseSection.type === 'business' ? 'New Business' : 'Established Business'}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Color</label>
                                <div className="mt-1 flex items-center gap-3">
                                    <div
                                        className="h-8 w-8 rounded-full border border-gray-300"
                                        style={{ backgroundColor: expertiseSection.color }}
                                    />
                                    <span className="font-mono text-sm">{expertiseSection.color}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Order</label>
                                <p className="text-lg">{expertiseSection.order}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Status</label>
                                <div className="mt-1">
                                    <Badge variant={expertiseSection.is_active ? 'default' : 'secondary'}>
                                        {expertiseSection.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Created</label>
                                <p>{new Date(expertiseSection.created_at).toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                                <p>{new Date(expertiseSection.updated_at).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <List className="h-5 w-5" />
                                Plans ({expertiseSection.plans.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {expertiseSection.plans
                                    .sort((a, b) => a.order - b.order)
                                    .map((plan, index) => (
                                        <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                                                {plan.order + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm">{plan.text}</p>
                                            </div>
                                        </div>
                                    ))}

                                {expertiseSection.plans.length === 0 && <p className="py-4 text-center text-gray-500">No plans added yet.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
