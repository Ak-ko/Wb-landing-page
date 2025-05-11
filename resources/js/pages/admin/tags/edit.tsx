import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import TagForm from '@/components/app/admin/tags/tag-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TagT } from '@/types';

export default function EditTag({ tag }: { tag: TagT }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tags',
            href: '/admin/tags',
        },
        {
            title: 'Edit',
            href: `/admin/tags/${tag.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Tag: ${tag.name}`} />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title={`Edit Tag: ${tag.name}`} description="Update tag information" />

                    <Button variant="outline" onClick={() => router.get('/admin/tags')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Tags
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <TagForm
                            tag={tag}
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
