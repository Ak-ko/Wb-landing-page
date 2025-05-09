import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title?: string;
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type TimestampsT = {
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type BrandT = {
    id: number;
    name: string;
    image: string;
    description: string;
    is_active: boolean;
} & TimestampsT;

export type TestimonialT = {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    position: string | null;
    company: string | null;
    description: string | null;
    image: string | null;
    color_tag: string | null;
} & TimestampsT;

export type BusinessProcessT = {
    id: number;
    title: string;
    description: string | null;
    image: string | null;
    color_tag: string;
    is_active: boolean;
    step: number;
} & TimestampsT;

interface CommonPaginationT<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
}
