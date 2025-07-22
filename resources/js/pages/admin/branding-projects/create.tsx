import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import BrandingProjectForm from '@/components/app/admin/branding-project/branding-project-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TagT } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/admin/branding-projects',
    },
    {
        title: 'Create',
        href: '/admin/branding-projects/create',
    },
];

export default function CreateBrandingProject({ tags }: { tags: TagT[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Create Project" description="Add a new project to your portfolio" />

                    <Button variant="outline" onClick={() => router.get('/admin/branding-projects')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <BrandingProjectForm
                            tags={tags}
                            onSubmit={(formData) => {
                                router.post(route('branding-projects.store'), formData, {
                                    forceFormData: true,
                                });
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
