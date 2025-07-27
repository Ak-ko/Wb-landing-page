import { BEHANCE, EMAIL, FACEBOOK, LINKEDIN, MESSENGER, PHONE } from '@/lib/social-links';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

import CommonBodyAnimation from './common-body-animation';
import ContactUsForm from './contact-us-form';
import BehanceIcon from './icons/social-links/benance-icon';
import FacebookIcon from './icons/social-links/facebook-icon';
import LinkedinIcon from './icons/social-links/linkedin-icon';
import MessengerIcon from './icons/social-links/messenger-icon';

export default function ContactUsSection() {
    return (
        <section className="py-32">
            <div className="app-container overflow-hidden">
                <CommonBodyAnimation>
                    <div className="flex flex-col items-center gap-11 lg:flex-row lg:items-stretch lg:justify-between lg:gap-0">
                        <motion.div initial={{ x: -100 }} whileInView={{ x: 0 }} className="flex flex-col justify-between">
                            <div className="max-w-[380px] space-y-1 text-center lg:text-start">
                                <h1 className="text-[40px] font-bold uppercase">Contact Us</h1>
                                <p className="font-normal">Let's connect! We're eager to hear from you and address any concerns.</p>
                            </div>
                            <div className="mt-11 lg:mt-0">
                                <div className="flex items-center justify-center gap-1 lg:justify-start">
                                    <a href={BEHANCE} target="_blank">
                                        <BehanceIcon className="size-[40px]" />
                                    </a>
                                    <a href={LINKEDIN} target="_blank">
                                        <LinkedinIcon className="ml-3 size-[48px]" />
                                    </a>
                                    <a href={FACEBOOK} target="_blank">
                                        <FacebookIcon className="size-[48px]" />
                                    </a>
                                </div>
                                <div className="relative flex justify-center lg:inline-flex">
                                    <div className="flex w-full flex-col justify-end gap-3">
                                        <div className="flex flex-col gap-2 xl:flex-row">
                                            <a
                                                className="bg-crayola-blue hover:bg-crayola-blue/80 flex items-center gap-2 rounded-xl px-8 py-4 text-white transition-all duration-500"
                                                href={MESSENGER}
                                                target="_blank"
                                            >
                                                <MessengerIcon className="size-[25px]" fill="white" /> <span>Page Messenger</span>
                                            </a>
                                            <a
                                                className="bg-primary hover:bg-primary/80 flex items-center gap-2 rounded-xl px-8 py-4 text-white transition-all duration-500"
                                                href={`mailto:${EMAIL}`}
                                            >
                                                <Mail /> <span>{EMAIL}</span>
                                            </a>
                                        </div>
                                        <a
                                            className="bg-secondary-pink hover:bg-secondary-pink/80 flex items-center gap-2 rounded-xl px-8 py-4 text-white transition-all duration-500"
                                            href={`tel:${PHONE}`}
                                        >
                                            <Phone /> <span>+95(9) 882 881 903</span>
                                        </a>
                                    </div>
                                    {/* <div className="absolute -right-[33%] -bottom-[35%] hidden xl:block">
                                        <CharacterWithTiltingStyle />
                                    </div>
                                    <AnimatePresence>
                                        <motion.div
                                            className="absolute -top-8 -right-[44%] hidden xl:block"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ delay: 0.1, duration: 0.3, type: 'spring' }}
                                        >
                                            <div className="relative max-w-[180px] rounded-xl bg-black p-4 text-white">
                                                <div className="absolute bottom-4 -left-2 h-4 w-4 rotate-45 transform bg-black"></div>
                                                <div className="font-medium">
                                                    <TypewriterText text={'Start Here'} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence> */}
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
