import Toast from '@/components/common/toast';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { usePage } from '@inertiajs/react';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    const flash = usePage().props;
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
            <Toast flash={flash} />
        </AuthLayoutTemplate>
    );
}
