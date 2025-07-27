import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';

export default function BusinessPlanHeader() {
    return (
        <section className="py-16">
            <div className="app-container">
                <SectionHeader
                    header="Small Business, Big Brand"
                    headerClass="max-w-[450px] 2xl:max-w-[800px]"
                    description="Affordable Design Packages Tailored for You"
                    descriptionClass="text-secondary-pink font-bold !text-[30px] !max-w-[700px] sm:!text-[35px] uppercase mt-2 "
                    containerClass="-mt-5"
                />
                <CommonBodyAnimation>
                    <p className="mx-auto mt-5 max-w-[800px] text-center text-lg font-medium 2xl:max-w-[900px] 2xl:text-3xl">
                        We understand the unique challenges of small businesses. That's why we've crafted packages that deliver maximum impact without
                        breaking the bank.
                    </p>
                </CommonBodyAnimation>
            </div>
        </section>
    );
}
