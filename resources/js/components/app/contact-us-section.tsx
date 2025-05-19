import ContactUsForm from './contact-us-form';
import CharacterWithTiltingStyle from './icons/characters/contact-us-section/character-with-tilting-style';
import BehanceIcon from './icons/social-links/benance-icon';
import FacebookIcon from './icons/social-links/facebook-icon';
import LinkedinIcon from './icons/social-links/linkedin-icon';

export default function ContactUsSection() {
    return (
        <section className="py-16">
            <div className="app-container">
                <div className="flex flex-col items-center gap-11 lg:flex-row lg:items-stretch lg:justify-between lg:gap-0">
                    <div className="flex flex-col justify-between">
                        <div className="max-w-[380px] space-y-1 text-center lg:text-start">
                            <h1 className="text-[40px] font-bold uppercase">Contact Us</h1>
                            <p>Let's connect! We're eager to hear from you and address any concerns.</p>
                        </div>
                        <div className="mt-11 lg:mt-0">
                            <div className="-ml-4 flex items-center justify-center gap-1 lg:justify-start">
                                <a href="#" target="_blank">
                                    <BehanceIcon />
                                </a>
                                <a href="#" target="_blank">
                                    <LinkedinIcon />
                                </a>
                                <a href="#" target="_blank">
                                    <FacebookIcon />
                                </a>
                            </div>
                            <div className="relative flex justify-center lg:inline-flex">
                                <a
                                    className="bg-crayola-blue hover:bg-crayola-blue/80 inline-block rounded-xl px-8 py-4 text-white transition-all duration-500"
                                    href="mailto:info@walkingbrands.co"
                                >
                                    Mailto:info@walkingbrands.co
                                </a>
                                <div className="absolute -right-[50%] -bottom-[80%] hidden lg:block">
                                    <CharacterWithTiltingStyle />
                                </div>
                            </div>
                        </div>
                    </div>
                    <ContactUsForm />
                </div>
            </div>
        </section>
    );
}
