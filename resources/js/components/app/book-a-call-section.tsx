import CommonBodyAnimation from './common-body-animation';

export default function BookACallSection() {
    return (
        <section className="py-32">
            <div className="app-container">
                <div className="flex items-center justify-center">
                    <CommonBodyAnimation>
                        <div className="space-y-2">
                            <h1 className="text-center text-[40px] leading-[1.1] font-bold md:text-[45px] lg:text-[60px]">
                                Got a <span className="text-crayola-blue">Project</span> in mind?
                                <br />
                                <span className="text-secondary-pink">Give us a call!</span>
                            </h1>
                            <p className="mt-4 text-center font-medium">
                                Book a free consultation call to see if Walking Brands is right for you.{' '}
                                <span className="text-secondary-pink bg-secondary-pink/20 px-1 font-bold italic">(We are.)</span>
                            </p>

                            <div className="my-11 flex justify-center">
                                <a href="https://calendly.com/walkingbrands-mm/45min" target="_blank" className="primary_btn">
                                    Book An Appointment
                                </a>
                            </div>
                        </div>
                    </CommonBodyAnimation>
                </div>
            </div>
        </section>
    );
}
