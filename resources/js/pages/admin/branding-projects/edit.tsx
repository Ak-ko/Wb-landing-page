import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import BrandingProjectForm from '@/components/app/admin/branding-project/branding-project-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BrandingProjectT, BreadcrumbItem, TagT } from '@/types';

interface EditBrandingProjectProps {
    brandingProject: BrandingProjectT;
    tags: TagT[];
}

export default function EditBrandingProject({ brandingProject, tags }: EditBrandingProjectProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Branding Projects',
            href: '/admin/branding-projects',
        },
        {
            title: 'Edit',
            href: `/admin/branding-projects/${brandingProject.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${brandingProject.title}`} />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title={`Edit ${brandingProject.title}`} description="Update this branding project's information" />

                    <Button variant="outline" onClick={() => router.get('/admin/branding-projects')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Branding Projects
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <BrandingProjectForm
                            tags={tags}
                            brandingProject={brandingProject}
                            onSuccess={() => router.get('/admin/branding-projects')}
                            onSubmit={(formData) => {
                                formData.append('_method', 'PUT');
                                router.post(route('branding-projects.update', brandingProject.id), formData, {
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
