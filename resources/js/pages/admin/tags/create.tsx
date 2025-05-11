import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import TagForm from '@/components/app/admin/tags/tag-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tags',
        href: '/admin/tags',
    },
    {
        title: 'Create',
        href: '/admin/tags/create',
    },
];

export default function CreateTag() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Tag" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title="Create Tag" description="Add a new tag to your collection" />

                    <Button variant="outline" onClick={() => router.get('/admin/tags')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Tags
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <TagForm
                            onSuccess={() => {
                                router.visit('/admin/tags', {
                                    only: ['tags'],
                                });
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
