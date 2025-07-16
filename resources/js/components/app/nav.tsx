import { useIsMobile } from '@/hooks/use-mobile';
import useScrollDirection from '@/hooks/use-scroll-direction';
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
    const { isVisible, isScrolled } = useScrollDirection();

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
        <header
            className={`fixed top-0 right-0 left-0 z-[999] min-h-[40px] bg-white transition-all duration-500 ease-in-out ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
        >
            <nav
                className={`app-container flex items-center justify-between transition-all duration-300 ${
                    isScrolled ? 'border-b border-gray-200' : ''
                }`}
            >
                <div className="transition-all duration-500 ease-out">
                    <Link href="/" className="h-[100px] transition-transform duration-500 hover:-translate-y-1 sm:ml-0">
                        <LogoWithTagLines className="h-[100px] w-[250px] object-cover select-none sm:w-[300px] lg:w-[350px]" />
                    </Link>
                </div>

                <button
                    ref={navToggleBtn}
                    onClick={handleToggleNav}
                    className="hover:text-secondary-pink active:text-secondary-pink cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-lg text-black transition-all duration-200 select-none hover:scale-105 active:scale-95 sm:flex"
                >
                    <Menu size={20} />
                    <span className="hidden font-bold md:block">MENU</span>
                </button>
            </nav>

            <NavSidebar />
        </header>
    );
}
