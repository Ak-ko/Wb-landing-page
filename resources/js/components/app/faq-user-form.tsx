import { useForm } from '@inertiajs/react';
import { Loader } from 'lucide-react';
import { ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import CharacterWithTwoFingers from './icons/characters/faq-section/character-with-two-finger';

export default function FaqUserForm() {
    const { data, errors, post, setData, reset, processing } = useForm({
        question: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('faq.send-email'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center gap-2">
                <CharacterWithTwoFingers className="w-[180px]" />
                <h1 className="text-center text-xl font-bold">Any Questions ?</h1>
                <p className="text-center text-sm font-light text-gray-500">You can ask anything you want to know about Feedback.</p>
            </div>
            <form onSubmit={handleSubmit} className="my-5 space-y-2">
                <div>
                    <Textarea
                        value={data.question}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            setData('question', e.target.value);
                        }}
                        className="min-h-[100px] resize-none bg-gray-100"
                        placeholder="Text your Questions Here..."
                    />
                    {errors.question && <p className="text-sm text-red-500">{errors.question}</p>}
                </div>
                <div>
                    <Input
                        value={data.email}
                        className="bg-gray-100"
                        placeholder="Your email..."
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setData('email', e.target.value);
                        }}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <Button disabled={processing} className="w-full py-6" size={'lg'}>
                    {processing && <Loader className="animate-spin" />}
                    Send Question
                </Button>
            </form>
        </div>
    );
}
