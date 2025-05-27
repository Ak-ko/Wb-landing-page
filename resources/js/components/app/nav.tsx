import { useIsMobile } from '@/hooks/use-mobile';
import useNavStore from '@/store/useNavStore';
import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { RefObject, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import LogoWithTagLines from './icons/logo-with-tag-line';
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
            <nav className="app-container flex items-center justify-between">
                <Link href="/" className="transition-transform duration-500 hover:-translate-y-1">
                    <LogoWithTagLines />
                </Link>
                <button
                    ref={navToggleBtn}
                    onClick={handleToggleNav}
                    className="hover:text-secondary-pink active:text-secondary-pink text-md cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-black select-none sm:flex"
                >
                    <Menu size={20} />
                    <span className="hidden font-bold md:block">MENU</span>
                </button>
            </nav>

            <NavSidebar />
        </header>
    );
}
