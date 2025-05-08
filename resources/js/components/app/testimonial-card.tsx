import { cn } from '@/lib/utils';
import { TestimonialT } from '@/types';
import CloseQuote from './icons/close-quote';

interface TestimonialCardProps {
    testimonial: TestimonialT;
    containerClass?: string;
}

export default function TestimonialCard({ testimonial, containerClass }: TestimonialCardProps) {
    const imageUrl = testimonial.image || '/assets/demo-testimonial-profile.png';
    const textColor = testimonial.color_tag || '#000000';

    return (
        <div className={cn('w-full rounded-xl bg-[#f4f4f4] p-4 shadow transition-all duration-300 md:p-12 lg:min-w-[550px]', containerClass)}>
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-start gap-2">
                    <img className="h-[55px] w-[55px] rounded-full object-cover" src={imageUrl} alt={testimonial.name || 'Client'} />
                    <div>
                        <h1 className="text-lg font-bold">{testimonial.name || 'Anonymous'}</h1>
                        {testimonial?.position && testimonial?.company && (
                            <p
                                style={{
                                    color: textColor,
                                }}
                                className="line-clamp-2 max-w-[350px] text-sm"
                            >
                                {testimonial.position}, {testimonial.company}
                            </p>
                        )}
                    </div>
                </div>
                <CloseQuote color={textColor} width={50} />
            </div>
            <p className="line-clamp-3 text-sm leading-[2]">{testimonial.description}</p>
        </div>
    );
}
