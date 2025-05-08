import SectionHeader from './section-header';
import TestimonialCard from './testimonial-card';

export default function TestimonialSection() {
    return (
        <section id="testimonials" className="app-container flex flex-col items-center py-28 lg:flex-row lg:items-start lg:justify-between">
            <SectionHeader
                containerClass="lg:block "
                headerClass="lg:text-start lg:max-w-sm"
                descriptionClass="lg:text-start !lg:max-w-[350px]"
                header="What our clients say"
                description="We aren’t just a great creative studio, we’re an excellent business partner."
            />
            <div className="w-full py-20 lg:w-auto lg:py-0">
                <TestimonialCard />
            </div>
        </section>
    );
}
