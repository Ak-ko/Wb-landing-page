import { ADMIN_PAGE_ENTER_CODE } from '@/lib/env';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ActivePing from './active-ping';
import HeroSectionBtn from './hero-section-btn';
import CharacterRedWithSpring from './icons/characters/hero-section/character-red-with-spring';
import CharacterWithCoffee from './icons/characters/hero-section/character-with-coffee';

export default function HeroSection() {
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PAGE_ENTER_CODE) {
            setShowPasswordPrompt(false);
            router.visit('/admin/dashboard');
        } else {
            setError('Incorrect password');
        }
    };

    const handleCancel = () => {
        setShowPasswordPrompt(false);
        setPassword('');
        setError('');
    };

    return (
        <div className="py-16">
            <motion.div
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ duration: 0.8, type: 'ease' }}
                whileInView={{ opacity: 1 }}
                className="flex flex-col items-center leading-[1.3] sm:leading-normal"
            >
                <h1 className="hero-section-header-text-size max-w-[360px] text-center font-extrabold uppercase sm:font-bold md:max-w-2xl xl:max-w-3xl">
                    creating brands <span className="text-secondary-pink">You can be proud of</span>
                </h1>
                <p className="mt-5 max-w-[300px] text-center text-xl font-semibold tracking-wide uppercase sm:max-w-full lg:mt-3">
                    a branding agency with a vision
                </p>
            </motion.div>

            {/* Password prompt modal */}
            {showPasswordPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-xl font-bold">Admin Access</h2>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="mb-4">
                                <label htmlFor="password" className="mb-1 block text-sm font-medium">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    autoFocus
                                />
                                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="relative flex max-w-[2500px] flex-col items-center justify-center gap-5 pt-7 lg:flex-row">
                <div className="hidden w-full md:block">
                    <CharacterWithCoffee className="hero__left__mascot absolute w-[120px] md:bottom-0 lg:-bottom-8 xl:left-[calc(100vw-76%)] 2xl:left-[calc(100vw-65%)]" />
                </div>
                <motion.div
                    className="relative flex w-full flex-col items-center justify-center gap-5 xl:flex-row"
                    animate={{ y: 0, opacity: 1 }}
                    initial={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.8, type: 'ease' }}
                >
                    <HeroSectionBtn
                        className="hover:bg-crayola-blue hover:shadow-crayola-blue/50 active:bg-crayola-blue hover:shadow-lg"
                        initialChildren={
                            <>
                                Make It Work with the <br /> power of design
                            </>
                        }
                        hoverChildren={
                            <>
                                Explore Our <br />
                                Design Packages
                            </>
                        }
                        href={route('business-plan-page')}
                    />
                    <HeroSectionBtn
                        className="hover:bg-chillie-red active:bg-chillie-red hover:shadow-chillie-red/50 hover:shadow-lg"
                        initialChildren={
                            <>
                                make it shine with the <br />
                                power of art
                            </>
                        }
                        hoverChildren={
                            <>
                                Explore Our <br />
                                Art Packages
                            </>
                        }
                        href={route('art-plan-page')}
                    />
                </motion.div>
                <div className="hidden w-full md:block">
                    <CharacterRedWithSpring className="hero__right__mascot absolute w-[170px] md:-bottom-5 lg:-bottom-13" />
                </div>
            </div>

            <div className="my-8 flex items-center justify-center gap-1.5">
                <ActivePing />
                <span className="text-sm font-light sm:text-lg">Available Now</span>
            </div>
        </div>
    );
}
