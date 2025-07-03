import CommonBodyAnimation from './common-body-animation';
import SectionHeader from './section-header';

export default function AboutUsHeader() {
    return (
        <section className="py-16">
            <div className="app-container">
                <SectionHeader
                    header="Meet"
                    description="the Walking Gang"
                    descriptionClass="text-secondary-pink font-bold !text-[40px]  sm:!text-[50px] uppercase -mt-5"
                />
                <CommonBodyAnimation>
                    <p className="text-md mx-auto mt-5 max-w-[800px] text-center font-medium sm:text-lg">
                        We are the Walking Brands: a dynamic team of experienced young professionals fueled by creativity and a passion for design
                        that bring a fresh perspective to the table.
                    </p>
                </CommonBodyAnimation>
            </div>
        </section>
    );
}
