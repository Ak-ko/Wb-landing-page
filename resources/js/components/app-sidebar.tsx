import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart2, Briefcase, Building, LayoutDashboard, MessageCircleQuestion, Settings, Tag, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        items: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: 'Brand Management',
        items: [
            {
                title: 'Brands',
                href: '/admin/brands',
                icon: Building,
            },
            {
                title: 'Branding Projects',
                href: '/admin/branding-projects',
                icon: Briefcase,
            },
            {
                title: 'Tags',
                href: '/admin/tags',
                icon: Tag,
            },
        ],
    },
    {
        title: 'Content Management',
        items: [
            {
                title: 'Testimonials',
                href: '/admin/testimonials',
                icon: Users,
            },
            {
                title: 'Business Processes',
                href: '/admin/business-processes',
                icon: BarChart2,
            },
            {
                title: 'Blog',
                href: '/admin/blogs',
                icon: Briefcase,
            },
        ],
    },
    {
        title: 'Faq Management',
        items: [
            {
                title: 'Faq',
                href: '/admin/faqs',
                icon: MessageCircleQuestion,
            },
        ],
    },
    {
        title: 'Settings',
        items: [
            {
                title: 'Profile Settings',
                href: '/settings/profile',
                icon: Settings,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Documentation',
    //     href: 'https://docs.walkingbrands.com',
    //     icon: BookOpen,
    // },
    // {
    //     title: 'Support',
    //     href: 'https://support.walkingbrands.com',
    //     icon: Handshake,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
