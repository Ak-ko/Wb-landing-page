import { BEHANCE, FACEBOOK, LINKEDIN } from '@/lib/social-links';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

import CommonBodyAnimation from './common-body-animation';
import ContactUsForm from './contact-us-form';
import CharacterWithTiltingStyle from './icons/characters/contact-us-section/character-with-tilting-style';
import BehanceIcon from './icons/social-links/benance-icon';
import FacebookIcon from './icons/social-links/facebook-icon';
import LinkedinIcon from './icons/social-links/linkedin-icon';
import TypewriterText from './type-write-text';

export default function ContactUsSection() {
    return (
        <section className="py-16">
            <div className="app-container overflow-hidden">
                <CommonBodyAnimation>
                    <div className="flex flex-col items-center gap-11 lg:flex-row lg:items-stretch lg:justify-between lg:gap-0">
                        <motion.div initial={{ x: -100 }} whileInView={{ x: 0 }} className="flex flex-col justify-between">
                            <div className="max-w-[380px] space-y-1 text-center lg:text-start">
                                <h1 className="text-[40px] font-bold uppercase">Contact Us</h1>
                                <p>Let's connect! We're eager to hear from you and address any concerns.</p>
                            </div>
                            <div className="mt-11 lg:mt-0">
                                <div className="-ml-4 flex items-center justify-center gap-1 lg:justify-start">
                                    <a href={BEHANCE} target="_blank">
                                        <BehanceIcon />
                                    </a>
                                    <a href={LINKEDIN} target="_blank">
                                        <LinkedinIcon />
                                    </a>
                                    <a href={FACEBOOK} target="_blank">
                                        <FacebookIcon />
                                    </a>
                                </div>
                                <div className="relative flex justify-center lg:inline-flex">
                                    <div className="flex w-full flex-col justify-end gap-3">
                                        <a
                                            className="bg-crayola-blue hover:bg-crayola-blue/80 flex items-center gap-2 rounded-xl px-8 py-4 text-white transition-all duration-500"
                                            href="mailto:info@walkingbrands.co"
                                        >
                                            <Mail /> <span>info@walkingbrands.co</span>
                                        </a>
                                        <a
                                            className="bg-secondary-pink hover:bg-secondary-pink/80 flex items-center gap-2 rounded-xl px-8 py-4 text-white transition-all duration-500"
                                            href="tel:+959422273300"
                                        >
                                            <Phone /> <span>09 422 273 300</span>
                                        </a>
                                    </div>
                                    <div className="absolute -right-[53%] -bottom-[35%] hidden lg:block">
                                        <CharacterWithTiltingStyle />
                                    </div>
                                    <AnimatePresence>
                                        <motion.div
                                            className="absolute -top-8 -right-[85%] hidden lg:block"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ delay: 0.1, duration: 0.3, type: 'spring' }}
                                        >
                                            <div className="relative max-w-[180px] rounded-xl bg-black p-4 text-white">
                                                <div className="absolute bottom-4 -left-2 h-4 w-4 rotate-45 transform bg-black"></div>
                                                <div className="font-medium">
                                                    <TypewriterText text={'Contact Us 😎'} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div initial={{ x: 100 }} whileInView={{ x: 0 }} className="w-full max-w-[500px]">
                            <ContactUsForm />
                        </motion.div>
                    </div>
                </CommonBodyAnimation>
            </div>
        </section>
    );
}
