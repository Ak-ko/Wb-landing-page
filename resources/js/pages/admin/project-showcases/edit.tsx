import ProjectShowcaseForm from '@/components/app/admin/project-showcases/project-showcase-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface ProjectShowcase {
    id: number;
    content: string;
    image: string;
    is_featured: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    projectShowcase: ProjectShowcase;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Showcases',
        href: '/admin/project-showcases',
    },
    {
        title: 'Edit',
        href: '/admin/project-showcases/edit',
    },
];

export default function Edit({ projectShowcase }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Project Showcase" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Edit Project Showcase" description="Update the project showcase details" />

                    <Button variant="outline" onClick={() => router.get('/admin/project-showcases')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Project Showcases
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <ProjectShowcaseForm projectShowcase={projectShowcase} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
