import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';

export default function BusinessPlanHeader() {
    return (
        <section className="py-16">
            <div className="app-container">
                <SectionHeader
                    header="Strategy-Based Branding"
                    description="HOW BRANDING DESIGN SHOULD BE DONE IN THE FIRST PLACE"
                    descriptionClass="text-secondary-pink font-bold !text-[30px] !max-w-[700px] 3xl:!max-w-[800px] sm:!text-[35px] uppercase mt-2 "
                    containerClass="-mt-5"
                />
                <CommonBodyAnimation>
                    <p className="mx-auto mt-5 text-center text-lg font-medium 2xl:text-3xl">
                        We transform businesses into brands that people can trust, follow, and love.
                    </p>
                </CommonBodyAnimation>
            </div>
        </section>
    );
}
