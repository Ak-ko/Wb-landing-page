import FaqForm from '@/components/app/admin/faq/faq-form';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function FaqCreate() {
    return (
        <AppLayout>
            <Head title="Create FAQ" />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Create FAQ</h1>
                </div>

                <div className="rounded-md border p-6">
                    <FaqForm />
                </div>
            </div>
        </AppLayout>
    );
}
