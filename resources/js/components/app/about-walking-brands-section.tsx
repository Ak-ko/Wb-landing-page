import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';

export default function AboutWalkingBrandSection() {
    return (
        <CommonBodyAnimation>
            <div className="py-32">
                <SectionHeader
                    header={
                        <>
                            What is <span className="text-secondary-orange">Walking Brands?</span>
                        </>
                    }
                    descriptionClass="text-center sm:!max-w-[1000px] 2xl:!max-w-[1200px] leading-[1.8] mt-7"
                    description={`Walking Brands is a design and art consultancy based in Myanmar that is committed to creating and evolving dynamic "Living Brands".Our core message, "Creating brands that can be proud of," highlights how Walking Brands builds brand identities that actively resonate and grow with their audience and the market. We achieve this by guiding clients from initial ideas to measurable success through strategic thinking, creative design and genuine partnerships.`}
                />
            </div>
        </CommonBodyAnimation>
    );
}
