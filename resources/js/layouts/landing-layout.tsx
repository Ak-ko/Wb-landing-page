import LandingFooter from '@/components/app/landing-footer';
import Navbar from '@/components/app/nav';
import Toast from '@/components/common/toast';
import { usePage } from '@inertiajs/react';
import React from 'react';

interface PropsT {
    children: React.ReactNode;
}

export default function LandingLayout({ children }: PropsT) {
    const { flash } = usePage().props;
    return (
        <section className="overflow-hidden">
            <Navbar />
            <div className="h-[100px]"></div>
            {children}
            <Toast flash={flash} />
            <LandingFooter />
        </section>
    );
}
