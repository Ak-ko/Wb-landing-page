import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { FaqT } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface FaqShowProps extends PageProps {
    faq: FaqT;
}

export default function FaqShow({ faq }: FaqShowProps) {
    return (
        <AppLayout>
            <Head title={`FAQ: ${faq.question}`} />
            <div className="container px-3 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('faqs.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{faq.question}</h1>
                    </div>
                    <Link href={route('faqs.edit', faq.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit FAQ
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <div className="rounded-md border p-6">
                            <h2 className="mb-2 text-lg font-semibold">Answer</h2>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer || 'No answer provided.' }} />
                        </div>
                    </div>
                    <div>
                        <div className="rounded-md border p-6">
                            <h2 className="mb-4 text-lg font-semibold">FAQ Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p>
                                        <Badge variant={faq.is_published ? 'default' : 'outline'} className="mt-1">
                                            {faq.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Color</p>
                                    <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: faq.color }} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Created At</p>
                                    <p>{new Date(faq.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Updated At</p>
                                    <p>{new Date(faq.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
