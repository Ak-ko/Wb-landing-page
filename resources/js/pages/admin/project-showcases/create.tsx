import ProjectShowcaseForm from '@/components/app/admin/project-showcases/project-showcase-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Showcases',
        href: '/admin/project-showcases',
    },
    {
        title: 'Create',
        href: '/admin/project-showcases/create',
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project Showcase" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Create Project Showcase" description="Add a new project showcase to the homepage" />

                    <Button variant="outline" onClick={() => router.get('/admin/project-showcases')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Project Showcases
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <ProjectShowcaseForm
                            onSuccess={() => {
                                router.visit('/admin/project-showcases', {
                                    only: ['projectShowcases'],
                                });
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
