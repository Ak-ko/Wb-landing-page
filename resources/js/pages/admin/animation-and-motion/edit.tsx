import AnimationAndMotionForm from '@/components/app/admin/animation-and-motion/animation-and-motion-form';
import AppLayout from '@/layouts/app-layout';
import { AnimationAndMotionT, BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head } from '@inertiajs/react';

interface AnimationAndMotionEditPropsT extends PageProps {
    animationAndMotion: AnimationAndMotionT;
}

export default function IllustrationEdit({ animationAndMotion }: AnimationAndMotionEditPropsT) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Animation and Motion Art',
            href: route('animation-and-motion.index'),
        },
        {
            title: 'Create',
            href: route('animation-and-motion.edit', animationAndMotion.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Animation and Motion: ${animationAndMotion.title}`} />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Edit Animation and Motion</h1>
                </div>

                <div className="rounded-md border p-6">
                    <AnimationAndMotionForm animationAndMotion={animationAndMotion} />
                </div>
            </div>
        </AppLayout>
    );
}
