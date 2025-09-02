import RichTextEditor from '@/components/app/admin/rich-editor/rich-text-editor';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';

interface PolicyFormProps {
    content: string;
    type: 'mission' | 'vision' | 'core_values';
    onSuccess: () => void;
}

export default function PolicyForm({ content, type, onSuccess }: PolicyFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        content: content,
        type: type,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('policies.update'), {
            onSuccess,
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <RichTextEditor
                    content={data.content}
                    onChange={(value) => setData('content', value)}
                    className={errors.content ? 'border-destructive' : ''}
                />
                {errors.content && <p className="text-destructive mt-1 text-sm">{errors.content}</p>}
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
