import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';

export default function AboutWalkingBrandSection() {
    return (
        <CommonBodyAnimation>
            <div className="py-32">
                <SectionHeader
                    header="What is  Walking Brands?"
                    descriptionClass="text-center sm:!max-w-[1000px] 2xl:!max-w-[1200px] leading-[1.8] mt-7"
                    description={`Walking Brands was founded on the belief that every business has a unique essence that can become a powerful "Living, Walking Brand." Our founders envisioned a consultancy that clarifies organisations through strategic visual brand designs, making complex ideas look simple and beautiful. We aim to transform businesses into brands that people can truly trust, follow, and love. Walking Brands provides a full suite of strategic branding services, serving businesses seeking comprehensive brand development.`}
                />
            </div>
        </CommonBodyAnimation>
    );
}
