import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Coins, Edit, Mail, Phone, User } from 'lucide-react';

import DashboardTitle from '@/components/app/dashboard-title';
import ProjectImageCarousel from '@/components/app/project-image-carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';
import { BrandingProjectT, BreadcrumbItem } from '@/types';

interface ShowBrandingProjectProps {
    brandingProject: BrandingProjectT;
}

export default function ShowBrandingProject({ brandingProject }: ShowBrandingProjectProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Branding Projects',
            href: '/admin/branding-projects',
        },
        {
            title: brandingProject.title,
            href: `/admin/branding-projects/${brandingProject.id}`,
        },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={brandingProject.title} />

            <div className="mx-auto max-w-7xl space-y-6 p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <DashboardTitle title={brandingProject.title} description={`Project for ${brandingProject.client_company}`} />

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => router.get('/admin/branding-projects')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Back to Projects</span>
                            <span className="sm:hidden">Back</span>
                        </Button>
                        <Button onClick={() => router.get(route('branding-projects.edit', brandingProject.id))}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Edit Project</span>
                            <span className="sm:hidden">Edit</span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-md lg:col-span-2">
                        <CardContent className="p-0">
                            {brandingProject.images && brandingProject.images.length > 0 && (
                                <div className="h-48 w-full overflow-hidden sm:h-64 md:h-80">
                                    <img
                                        src={`/storage/${brandingProject.images.find((img) => img.is_primary)?.image || brandingProject.images[0].image}`}
                                        alt={brandingProject.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="mb-4 text-2xl font-semibold text-gray-800">Project Details</h3>

                                {brandingProject.description && (
                                    <div className="mb-6">
                                        <h4 className="mb-2 text-lg font-medium text-gray-700">Description</h4>
                                        <p className="leading-relaxed text-gray-600">{brandingProject.description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h4 className="mb-3 text-lg font-medium text-gray-700">Client Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <User className="text-primary h-4 w-4" />
                                                <span className="font-medium">{brandingProject.client_company}</span>
                                            </div>

                                            {brandingProject.client_name && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User className="text-primary h-4 w-4" />
                                                    <span>{brandingProject.client_name}</span>
                                                </div>
                                            )}

                                            {brandingProject.client_email && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail className="text-primary h-4 w-4" />
                                                    <a
                                                        href={`mailto:${brandingProject.client_email}`}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {brandingProject.client_email}
                                                    </a>
                                                </div>
                                            )}

                                            {brandingProject.client_phone && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone className="text-primary h-4 w-4" />
                                                    <a href={`tel:${brandingProject.client_phone}`} className="hover:text-primary transition-colors">
                                                        {brandingProject.client_phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="mb-3 text-lg font-medium text-gray-700">Project Details</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="text-primary h-4 w-4" />
                                                <span>
                                                    <span className="font-medium">Period:</span> {formatDate(brandingProject.service_start_date)} -{' '}
                                                    {formatDate(brandingProject.service_end_date)}
                                                </span>
                                            </div>

                                            {brandingProject.service_fees && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Coins className="text-primary h-4 w-4" />
                                                    <span>
                                                        <span className="font-medium">Fees:</span> {formatCurrency(brandingProject.service_fees)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {brandingProject.tags && brandingProject.tags.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="mb-3 text-lg font-medium text-gray-700">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {brandingProject.tags.map((tag) => (
                                                <Badge key={tag.id} className="px-3 py-1 text-sm font-medium" style={{ backgroundColor: tag.color }}>
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow duration-300 hover:shadow-md">
                        <CardContent className="p-6">
                            <h3 className="mb-4 text-xl font-semibold text-gray-800">Project Gallery</h3>

                            <ProjectImageCarousel images={brandingProject.images} projectTitle={brandingProject.title} />

                            <Separator className="my-6" />

                            <div className="space-y-1 text-sm text-gray-500">
                                <p className="flex justify-between">
                                    <span className="font-medium">Created:</span>
                                    <time dateTime={brandingProject.created_at}>{new Date(brandingProject.created_at).toLocaleString()}</time>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium">Last Updated:</span>
                                    <time dateTime={brandingProject.updated_at}>{new Date(brandingProject.updated_at).toLocaleString()}</time>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
