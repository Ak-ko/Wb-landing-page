import { useForm } from '@inertiajs/react';
import { Loader } from 'lucide-react';
import { ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export default function ContactUsForm() {
    const { data, errors, post, setData, reset, processing } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('contact.send'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <div className="w-full max-w-[500px] rounded-xl bg-white">
            <h2 className="mb-4 text-center text-xl font-bold uppercase lg:text-start">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        value={data.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setData('name', e.target.value);
                        }}
                        className="bg-gray-100 py-5"
                        placeholder="Your name"
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                    <Input
                        value={data.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setData('email', e.target.value);
                        }}
                        className="bg-gray-100 py-5"
                        placeholder="Your email"
                        type="email"
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <Input
                        value={data.phone}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setData('phone', e.target.value);
                        }}
                        className="bg-gray-100 py-5"
                        placeholder="Your phone number"
                        type="tel"
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                    <Textarea
                        value={data.message}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            setData('message', e.target.value);
                        }}
                        className="min-h-[120px] resize-none bg-gray-100"
                        placeholder="Your message..."
                    />
                    {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                </div>

                <Button disabled={processing} className="w-full cursor-pointer" size={'lg'}>
                    {processing && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Send Message
                </Button>
            </form>
        </div>
    );
}
