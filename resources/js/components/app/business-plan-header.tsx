import SectionHeader from './section-header';

export default function BusinessPlanHeader() {
    return (
        <section className="py-16">
            <div className="app-container">
                <SectionHeader
                    header="Small Business, Big Brand"
                    headerClass="max-w-[450px]"
                    description="Affordable Design Packages Tailored for You"
                    descriptionClass="text-secondary-pink font-bold !text-[30px] !max-w-[700px] sm:!text-[35px] uppercase mt-2"
                    containerClass="-mt-5"
                />
                <p className="mx-auto mt-5 max-w-[800px] text-center text-lg font-medium">
                    We understand the unique challenges of small businesses. That's why we've crafted packages that deliver maximum impact without
                    breaking the bank.
                </p>
            </div>
        </section>
    );
}
