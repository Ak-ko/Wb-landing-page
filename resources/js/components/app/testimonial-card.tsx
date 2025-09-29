import { cn } from '@/lib/utils';
import { TestimonialT } from '@/types';
import CloseQuote from './icons/close-quote';

interface TestimonialCardProps {
    testimonial: TestimonialT;
    containerClass?: string;
    onClick?: () => void;
}

export default function TestimonialCard({ testimonial, containerClass, onClick }: TestimonialCardProps) {
    const imageUrl = testimonial.image || '/assets/demo-testimonial-profile.png';
    const textColor = testimonial.color_tag || '#000000';

    return (
        <div
            className={cn(
                '3xl:!min-w-[900px] w-full rounded-xl bg-[#f4f4f4] p-6 shadow transition-all duration-300 md:p-16 lg:min-w-[650px]',
                'transform cursor-pointer hover:-translate-y-1 hover:shadow-lg',
                containerClass,
            )}
            onClick={onClick}
        >
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <img className="h-[70px] w-[70px] rounded-full object-cover" src={imageUrl} alt={testimonial.name || 'Client'} />
                    <div>
                        <h1 className="text-xl font-bold">{testimonial.name || 'Anonymous'}</h1>
                        {testimonial?.position && testimonial?.company && (
                            <p
                                style={{
                                    color: textColor,
                                }}
                                className="line-clamp-2 max-w-[400px] text-base"
                            >
                                {testimonial.position}, {testimonial.company}
                            </p>
                        )}
                    </div>
                </div>
                <CloseQuote color={textColor} width={60} />
            </div>
            <p className="line-clamp-5 text-base leading-[2] font-light">{testimonial.description}</p>
        </div>
    );
}
