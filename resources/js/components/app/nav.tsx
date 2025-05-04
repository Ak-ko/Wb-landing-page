import { useIsMobile } from '@/hooks/use-mobile';
import useNavStore from '@/store/useNavStore';
import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { RefObject, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import Logo from './icons/logo';
import NavSidebar from './nav-sidebar';

export default function Navbar() {
    const { isToggle, toggle } = useNavStore();
    const isMobile = useIsMobile();
    const navToggleBtn = useRef<HTMLButtonElement>(null);

    const handleToggleNav = () => {
        toggle();
    };

    const handleNavClickoutside = () => {
        if (!isMobile && isToggle) {
            handleToggleNav();
        }
    };

    useOnClickOutside(navToggleBtn as RefObject<HTMLButtonElement>, handleNavClickoutside);

    return (
        <header className="min-h-[50px]">
            <nav className="app-container flex items-center justify-between border-b py-4">
                <Link className="font-inter text-xl font-bold" href="/">
                    WALKING BRANDS
                </Link>
                <div
                    onClick={() => {
                        if (isMobile) {
                            handleToggleNav();
                        }
                    }}
                >
                    <Logo className="size-[60px] sm:-translate-x-[70%]" />
                </div>
                <button
                    ref={navToggleBtn}
                    onClick={handleToggleNav}
                    className="hover:bg-secondary-pink active:bg-secondary-pink text-md hidden cursor-pointer items-center gap-2 rounded-full bg-black px-3 py-1 text-white select-none sm:flex"
                >
                    <Menu size={20} />
                    <span>MENU</span>
                </button>
            </nav>

            <NavSidebar />
        </header>
    );
}
