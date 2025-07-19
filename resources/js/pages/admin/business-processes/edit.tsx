import BusinessProcessForm from '@/components/app/admin/business-process/business-process-form';
import { Button } from '@/components/ui/button';
import { BusinessProcessT } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    businessProcess: BusinessProcessT;
}

export default function EditBusinessProcess({ businessProcess }: Props) {
    const handleSuccess = () => {
        router.visit(route('business-processes.index'));
    };

    return (
        <>
            <Head title={`Edit Creative Process: ${businessProcess.title}`} />

            <div className="container py-6">
                <div className="mb-8">
                    <Button variant="outline" onClick={() => router.visit(route('business-processes.index'))}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Creative Processes
                    </Button>
                </div>

                <div className="mx-auto max-w-2xl rounded-lg border p-6 shadow-sm">
                    <h1 className="mb-6 text-2xl font-bold">Edit Creative Process</h1>
                    <BusinessProcessForm businessProcess={businessProcess} onSuccess={handleSuccess} />
                </div>
            </div>
        </>
    );
}
