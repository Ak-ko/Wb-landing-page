import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import TestimonialForm from '@/components/app/admin/testimonials/testimonial-form';
import DashboardTitle from '@/components/app/dashboard-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TestimonialT } from '@/types';

export default function EditTestimonial({ testimonial }: { testimonial: TestimonialT }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Testimonials',
            href: '/admin/testimonials',
        },
        {
            title: 'Edit',
            href: `/admin/testimonials/${testimonial.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Testimonial: ${testimonial.name || 'Anonymous'}`} />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <DashboardTitle title={`Edit Testimonial: ${testimonial.name || 'Anonymous'}`} description="Update testimonial information" />

                    <Button variant="outline" onClick={() => router.get('/admin/testimonials')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Testimonials
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <TestimonialForm
                            testimonial={testimonial}
                            onSuccess={() => {
                                router.visit('/admin/testimonials', {
                                    only: ['testimonials'],
                                });
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
