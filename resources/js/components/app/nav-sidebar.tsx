import useScroll from '@/hooks/use-scroll';
import useNavStore from '@/store/useNavStore';
import { ChevronsRight } from 'lucide-react';
import Logo from './icons/logo';

type LinksT = {
    label: string;
    href: string;
};

const links: LinksT[] = [
    {
        label: 'About',
        href: '#about',
    },
    {
        label: 'Work',
        href: '#work',
    },
    {
        label: 'Services',
        href: '#services',
    },
    {
        label: 'Contact',
        href: '#contact',
    },
];

export default function NavSidebar() {
    const { scrollTo } = useScroll();
    const { isToggle, toggle } = useNavStore();

    const handleCloseNav = () => {
        toggle();
    };

    return (
        <div
            className={`fixed top-0 bottom-0 z-[888] h-screen w-screen bg-black transition-all duration-300 ease-in md:w-[40vw] lg:w-[30vw] ${isToggle ? 'right-0' : '-right-[100%] md:-right-[60%]'}`}
        >
            <div className="hidden min-h-[92px] items-center justify-between border-b border-b-white/25 px-5 py-3 sm:flex">
                <div className="flex items-center gap-2 text-white">
                    <Logo fill="white" className="size-[40px] stroke-white" />
                    <span className="font-bold">MENU</span>
                </div>
                <button onClick={handleCloseNav} className="flex items-center gap-1 text-white">
                    <span className="text-sm font-bold uppercase">Back</span>
                    <ChevronsRight size={20} />
                </button>
            </div>

            <div className="mx-5 flex min-h-[92px] items-center justify-between border-b border-b-white/25 py-3 sm:hidden">
                <div className="text-xl font-bold text-white">WALKING BRANDS</div>
                <div onClick={handleCloseNav}>
                    <Logo fill="#fff" className="size-[60px] text-white sm:-translate-x-[50%]" />
                </div>
            </div>

            <div className="hidden h-full w-full items-center sm:flex">
                <div className="w-full -translate-y-[50%] text-white">
                    {links?.map((link: LinksT) => (
                        <div
                            onClick={() => scrollTo(link.href, 0, 400)}
                            key={link.href}
                            className="flex min-h-[60px] w-full cursor-pointer items-center justify-center border-b border-b-white/25 font-bold text-white/50 uppercase transition-all duration-500 hover:text-white"
                        >
                            {link.label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-full">
                <div className="flex h-[75%] flex-col justify-around overflow-y-auto py-11">
                    {links?.map((link: LinksT) => (
                        <div
                            onClick={() => scrollTo(link.href, 0, 400)}
                            key={link.href}
                            className="flex min-h-[60px] w-full cursor-pointer items-center justify-center text-lg font-bold text-white/50 uppercase transition-all duration-500 hover:text-white active:text-white"
                        >
                            {link.label}
                        </div>
                    ))}
                </div>
                <div className="mx-5 flex h-[10%] items-center justify-center border-t border-t-white/25 text-white">
                    <button onClick={handleCloseNav} className="flex items-center justify-center gap-2">
                        <span className="text-lg uppercase">Go Back</span>
                        <ChevronsRight size={25} />
                    </button>
                </div>
            </div>
        </div>
    );
}
