import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, Clock, Edit, X } from 'lucide-react';

interface ProjectShowcase {
    id: number;
    content: string;
    image: string;
    image_url: string;
    is_featured: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    projectShowcase: ProjectShowcase;
}

export default function Show({ projectShowcase }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Project Showcases',
            href: '/admin/project-showcases',
        },
        {
            title: `Showcase #${projectShowcase.id}`,
            href: `/admin/project-showcases/${projectShowcase.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Project Showcase #${projectShowcase.id}`} />
            <div className="space-y-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href={route('project-showcases.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">Project Showcase #{projectShowcase.id}</h1>
                        <p className="text-muted-foreground">Project showcase details and information.</p>
                    </div>
                    <Link href={route('project-showcases.edit', projectShowcase.id)}>
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
                                <label className="text-muted-foreground text-sm font-medium">Content</label>
                                <p className="mt-1 text-sm">{projectShowcase.content}</p>
                            </div>

                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Image</label>
                                <div className="mt-1">
                                    <img src={projectShowcase.image_url} alt="Project Showcase" className="h-32 w-32 rounded border object-cover" />
                                </div>
                            </div>

                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Order</label>
                                <p className="text-lg font-semibold">{projectShowcase.order}</p>
                            </div>

                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Featured Status</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <div
                                        className="flex h-6 w-6 items-center justify-center rounded-full border-2 text-white"
                                        style={{
                                            backgroundColor: projectShowcase.is_featured ? '#1274ef' : '#e53726',
                                            borderColor: projectShowcase.is_featured ? '#1274ef' : '#e53726',
                                        }}
                                    >
                                        {projectShowcase.is_featured ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                    </div>
                                    <span className="text-sm">{projectShowcase.is_featured ? 'Featured' : 'Not Featured'}</span>
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
                                        {new Date(projectShowcase.created_at).toLocaleDateString()} at{' '}
                                        {new Date(projectShowcase.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="text-muted-foreground h-4 w-4" />
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Last Updated</label>
                                    <p className="text-sm">
                                        {new Date(projectShowcase.updated_at).toLocaleDateString()} at{' '}
                                        {new Date(projectShowcase.updated_at).toLocaleTimeString()}
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
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                            <div>
                                <img
                                    src={projectShowcase.image_url}
                                    alt="Project Showcase Preview"
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="flex items-center">
                                <p className="text-xl font-light">{projectShowcase.content}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
