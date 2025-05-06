import Toast from '@/components/common/toast';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import AppHeaderLayout from './app/app-sidebar-layout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const flash = usePage().props;
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toast flash={flash} />
        </AppHeaderLayout>
    );
};
