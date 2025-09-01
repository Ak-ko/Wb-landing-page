import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PlanItem {
    text: string;
    order: number;
}

interface ExpertiseSectionT {
    id: number;
    title: string;
    type: 'business' | 'established';
    plans: PlanItem[];
    color: string;
    order: number;
    is_active: boolean;
}

interface ExpertiseSectionFormProps {
    expertiseSection?: ExpertiseSectionT;
    onSuccess: () => void;
}

export default function ExpertiseSectionForm({ expertiseSection, onSuccess }: ExpertiseSectionFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: expertiseSection?.title || '',
        type: expertiseSection?.type || 'business',
        plans: expertiseSection?.plans || [{ text: '', order: 0 }],
        color: expertiseSection?.color || '#1CB3CE',
        order: expertiseSection?.order || 0,
        is_active: expertiseSection?.is_active ?? true,
    });

    const [colorInput, setColorInput] = useState(data.color);

    const errorMap = errors as Record<string, string>;

    const addPlan = () => {
        setData('plans', [...data.plans, { text: '', order: data.plans.length }]);
    };

    const removePlan = (index: number) => {
        const updatedPlans = [...data.plans];
        updatedPlans.splice(index, 1);
        // Reorder remaining plans
        updatedPlans.forEach((plan, i) => {
            plan.order = i;
        });
        setData('plans', updatedPlans);
    };

    const updatePlanText = (index: number, text: string) => {
        const updatedPlans = [...data.plans];
        updatedPlans[index].text = text;
        setData('plans', updatedPlans);
    };

    const updatePlanOrder = (index: number, order: number) => {
        const updatedPlans = [...data.plans];
        updatedPlans[index].order = order;
        setData('plans', updatedPlans);
    };

    const movePlan = (index: number, direction: 'up' | 'down') => {
        const updatedPlans = [...data.plans];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < updatedPlans.length) {
            // Swap items
            [updatedPlans[index], updatedPlans[targetIndex]] = [updatedPlans[targetIndex], updatedPlans[index]];

            // Update order values
            updatedPlans.forEach((plan, i) => {
                plan.order = i;
            });

            setData('plans', updatedPlans);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = {
            ...data,
            color: colorInput,
        };

        if (expertiseSection) {
            put(route('expertise-sections.update', expertiseSection.id), {
                data: submitData,
                onSuccess: () => {
                    onSuccess();
                },
            });
        } else {
            post(route('expertise-sections.store'), {
                data: submitData,
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Section Title</Label>
                <Input
                    id="title"
                    placeholder="e.g., Setting up your New Business?"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                />
                {errorMap.title && <p className="text-sm text-red-500">{errorMap.title}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="type">Section Type</Label>
                <Select value={data.type} onValueChange={(value: 'business' | 'established') => setData('type', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select section type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="business">New Business</SelectItem>
                        <SelectItem value="established">Established Business</SelectItem>
                    </SelectContent>
                </Select>
                {errorMap.type && <p className="text-sm text-red-500">{errorMap.type}</p>}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Plans</Label>
                    <Button type="button" onClick={addPlan} size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Plan
                    </Button>
                </div>

                <div className="space-y-3">
                    {data.plans.map((plan, index) => (
                        <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                            <div className="flex flex-col gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => movePlan(index, 'up')}
                                    disabled={index === 0}
                                    className="h-6 w-6 p-0"
                                >
                                    ↑
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => movePlan(index, 'down')}
                                    disabled={index === data.plans.length - 1}
                                    className="h-6 w-6 p-0"
                                >
                                    ↓
                                </Button>
                            </div>

                            <div className="flex-1">
                                <Input placeholder="Plan text" value={plan.text} onChange={(e) => updatePlanText(index, e.target.value)} />
                                {errorMap[`plans.${index}.text`] && <p className="mt-1 text-sm text-red-500">{errorMap[`plans.${index}.text`]}</p>}
                            </div>

                            <div className="w-20">
                                <Input
                                    type="number"
                                    placeholder="Order"
                                    value={plan.order}
                                    onChange={(e) => updatePlanOrder(index, parseInt(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={() => removePlan(index)}
                                variant="destructive"
                                size="sm"
                                disabled={data.plans.length === 1}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                {errorMap.plans && <p className="text-sm text-red-500">{errorMap.plans}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="color">Highlight Color</Label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        id="color"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        className="h-10 w-16 cursor-pointer rounded border border-gray-300"
                    />
                    <Input value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="#1CB3CE" className="flex-1" />
                    <div className="h-10 w-10 rounded border border-gray-300" style={{ backgroundColor: colorInput }} />
                </div>
                {errorMap.color && <p className="text-sm text-red-500">{errorMap.color}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                    id="order"
                    type="number"
                    placeholder="0"
                    value={data.order}
                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                    min="0"
                />
                {errorMap.order && <p className="text-sm text-red-500">{errorMap.order}</p>}
            </div>

            <div className="flex items-center space-x-2">
                <Switch id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onSuccess}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {expertiseSection ? 'Update Section' : 'Create Section'}
                </Button>
            </div>
        </form>
    );
}
