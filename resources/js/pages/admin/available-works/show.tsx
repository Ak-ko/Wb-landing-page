import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Edit } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface AvailableWork {
    id: number;
    label: string;
    color: string;
    is_published: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    availableWork: AvailableWork;
}

export default function Show({ availableWork }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Available Works',
            href: '/admin/available-works',
        },
        {
            title: availableWork.label,
            href: `/admin/available-works/${availableWork.id}`,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Available Work - ${availableWork.label}`} />
            <div className="space-y-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href={route('available-works.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">{availableWork.label}</h1>
                        <p className="text-muted-foreground">Available work details and information.</p>
                    </div>
                    <Link href={route('available-works.edit', availableWork.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Label</label>
                                <p className="text-lg font-semibold">{availableWork.label}</p>
                            </div>

                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Color</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: availableWork.color }} />
                                    <span className="font-mono text-sm">{availableWork.color}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Order</label>
                                <p className="text-lg font-semibold">{availableWork.order}</p>
                            </div>

                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Status</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <Switch checked={availableWork.is_published} disabled />
                                    <span className="text-sm">{availableWork.is_published ? 'Published' : 'Draft'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Timestamps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-muted-foreground h-4 w-4" />
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Created</label>
                                    <p className="text-sm">
                                        {new Date(availableWork.created_at).toLocaleDateString()} at{' '}
                                        {new Date(availableWork.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="text-muted-foreground h-4 w-4" />
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Last Updated</label>
                                    <p className="text-sm">
                                        {new Date(availableWork.updated_at).toLocaleDateString()} at{' '}
                                        {new Date(availableWork.updated_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div
                                className="inline-block rounded-full px-4 py-2 text-sm font-medium"
                                style={{
                                    backgroundColor: availableWork.color,
                                    color: availableWork.color === '#FEC901' ? '#000' : '#fff',
                                }}
                            >
                                {availableWork.label}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
