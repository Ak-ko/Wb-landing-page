import BusinessProcessForm from '@/components/app/admin/business-process/business-process-form';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function CreateBusinessProcess() {
    const handleSuccess = () => {
        router.visit(route('business-processes.index'));
    };

    return (
        <>
            <Head title="Create Business Process" />

            <div className="container py-6">
                <div className="mb-8">
                    <Button variant="outline" onClick={() => router.visit(route('business-processes.index'))}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Business Processes
                    </Button>
                </div>

                <div className="mx-auto max-w-2xl rounded-lg border p-6 shadow-sm">
                    <h1 className="mb-6 text-2xl font-bold">Create Business Process</h1>
                    <BusinessProcessForm onSuccess={handleSuccess} />
                </div>
            </div>
        </>
    );
}
