import { Button } from '@/components/ui/button';
import { ColorInput } from '@/components/ui/color-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { FaqT } from '@/types';
import { useForm } from '@inertiajs/react';
import RichTextEditor from '../rich-editor/rich-text-editor';

interface FaqFormProps {
    faq?: FaqT;
}

export default function FaqForm({ faq }: FaqFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        question: faq?.question || '',
        answer: faq?.answer || '',
        is_published: faq?.is_published ?? true,
        color: faq?.color || '#3b82f6',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (faq) {
            put(route('faqs.update', faq.id));
        } else {
            post(route('faqs.store'), {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="question">Question</Label>
                    <Input
                        id="question"
                        value={data.question}
                        onChange={(e) => setData('question', e.target.value)}
                        className={cn(errors.question && 'border-destructive')}
                    />
                    {errors.question && <p className="text-destructive mt-1 text-sm">{errors.question}</p>}
                </div>

                <div>
                    <Label htmlFor="answer">Answer</Label>
                    <RichTextEditor
                        content={data.answer}
                        onChange={(value) => setData('answer', value)}
                        className={cn(errors.answer && 'border-destructive')}
                    />
                    {errors.answer && <p className="text-destructive mt-1 text-sm">{errors.answer}</p>}
                </div>

                <ColorInput label="Color" value={data.color} onChange={(value) => setData('color', value)} error={errors.color} />

                <div className="flex items-center space-x-2">
                    <Switch id="is_published" checked={data.is_published} onCheckedChange={(checked) => setData('is_published', checked)} />
                    <Label htmlFor="is_published">Published</Label>
                </div>
            </div>

            <Button type="submit" disabled={processing}>
                {faq ? 'Update' : 'Create'} FAQ
            </Button>
        </form>
    );
}
