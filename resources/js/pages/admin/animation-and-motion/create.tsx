import AnimationAndMotionForm from '@/components/app/admin/animation-and-motion/animation-and-motion-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Animation And Motion Arts',
        href: route('animation-and-motion.index'),
    },
    {
        title: 'Create',
        href: route('animation-and-motion.create'),
    },
];
export default function AnimationAndMotionCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Animation and Motion Art" />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Create Animation and Motion</h1>
                </div>
                <div className="rounded-md border p-6">
                    <AnimationAndMotionForm />
                </div>
            </div>
        </AppLayout>
    );
}
