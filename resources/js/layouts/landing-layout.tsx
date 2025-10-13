import Toast from '@/components/common/toast';
import { usePage } from '@inertiajs/react';
import React, { lazy } from 'react';

const Navbar = lazy(() => import('@/components/app/nav'));
const LandingFooter = lazy(() => import('@/components/app/landing-footer'));

interface PropsT {
    children: React.ReactNode;
}

export default function LandingLayout({ children }: PropsT) {
    const { flash } = usePage().props;
    return (
        <section className="overflow-hidden">
            <div className="flex min-h-screen flex-col justify-between">
                <Navbar />
                <div className="h-[100px]"></div>
                <div>{children}</div>
            </div>
            <Toast flash={flash} />
            <LandingFooter />
        </section>
    );
}
