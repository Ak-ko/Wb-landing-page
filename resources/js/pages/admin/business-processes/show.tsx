import ColorTag from '@/components/app/color-tag';
import { Button } from '@/components/ui/button';
import { BusinessProcessT } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface Props {
    businessProcess: BusinessProcessT;
}

export default function ShowBusinessProcess({ businessProcess }: Props) {
    return (
        <>
            <Head title={`Creative Process: ${businessProcess.title}`} />

            <div className="container py-6">
                <div className="mb-8">
                    <Button variant="outline" onClick={() => router.visit(route('business-processes.index'))}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Creative Processes
                    </Button>
                </div>

                <div className="mx-auto max-w-3xl rounded-lg border p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">{businessProcess.title}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Status:</span>
                                <span
                                    className={`rounded-full px-2 py-1 text-xs ${businessProcess.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                >
                                    {businessProcess.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <Button onClick={() => router.visit(route('business-processes.edit', businessProcess.id))}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {businessProcess.image && (
                            <div className="overflow-hidden rounded-lg">
                                <img src={businessProcess.image} alt={businessProcess.title} className="h-full w-full object-cover" />
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <h2 className="mb-2 text-lg font-medium">Color Tag</h2>
                                <div className="flex items-center gap-3">
                                    <ColorTag color={businessProcess.color_tag} />
                                    <span>{businessProcess.color_tag}</span>
                                </div>
                            </div>

                            {businessProcess.description && (
                                <div>
                                    <h2 className="mb-2 text-lg font-medium">Description</h2>
                                    <p className="whitespace-pre-wrap text-gray-700">{businessProcess.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
