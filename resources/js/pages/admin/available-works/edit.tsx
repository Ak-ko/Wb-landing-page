import { ColorInput } from '@/components/common/color-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface AvailableWork {
    id: number;
    label: string;
    color: string;
    text_color: string;
    is_published: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    availableWork: AvailableWork;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Available Works',
        href: '/admin/available-works',
    },
    {
        title: 'Edit',
        href: '/admin/available-works/edit',
    },
];

export default function Edit({ availableWork }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        label: availableWork.label,
        color: availableWork.color,
        text_color: availableWork.text_color,
        is_published: availableWork.is_published,
        order: availableWork.order,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('available-works.update', availableWork.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Available Work" />
            <div className="space-y-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href={route('available-works.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Available Work</h1>
                        <p className="text-muted-foreground">Update the available work details.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Available Work Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">Label</Label>
                                <Input
                                    id="label"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    placeholder="Enter the label for this work"
                                    className={errors.label ? 'border-red-500' : ''}
                                />
                                {errors.label && <p className="text-sm text-red-500">{errors.label}</p>}
                            </div>

                            <ColorInput
                                backgroundColor={data.color}
                                textColor={data.text_color}
                                onBackgroundColorChange={(color) => setData('color', color)}
                                onTextColorChange={(color) => setData('text_color', color)}
                                backgroundColorError={errors.color}
                                textColorError={errors.text_color}
                            />

                            <div className="space-y-2">
                                <Label htmlFor="order">Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    min="0"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                />
                                {errors.order && <p className="text-sm text-red-500">{errors.order}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_published"
                                    checked={data.is_published}
                                    onCheckedChange={(checked) => setData('is_published', checked)}
                                />
                                <Label htmlFor="is_published">Published</Label>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Available Work'}
                                </Button>
                                <Link href={route('available-works.index')}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
