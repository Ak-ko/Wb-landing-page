import FaqForm from '@/components/app/admin/faq/faq-form';
import AppLayout from '@/layouts/app-layout';
import { FaqT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, router } from '@inertiajs/react';

interface FaqEditProps extends PageProps {
    faq: FaqT;
}

export default function FaqEdit({ faq }: FaqEditProps) {
    const handleSuccess = () => {
        router.visit(route('faqs.index'));
    };

    return (
        <AppLayout>
            <Head title={`Edit FAQ: ${faq.question}`} />
            <div className="container px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Edit FAQ</h1>
                </div>

                <div className="rounded-md border p-6">
                    <FaqForm faq={faq} onSuccess={handleSuccess} />
                </div>
            </div>
        </AppLayout>
    );
}
