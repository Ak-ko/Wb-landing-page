/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type TagT = {
    id: number;
    name: string;
    color: string;
} & TimestampsT;

export type BrandingProjectImageT = {
    id: number;
    branding_project_id: number;
    image: string;
    is_primary: boolean;
    order: number;
} & TimestampsT;

export type BrandingProjectT = {
    id: number;
    title: string;
    description: string | null;
    client_name: string;
    client_company: string;
    client_email: string;
    client_phone: string;
    service_fees: number | null;
    service_start_date: string | null;
    service_end_date: string | null;
    tags: TagT[];
    images: BrandingProjectImageT[];
} & TimestampsT;

export type BlogImage = {
    id: number;
    blog_id: number;
    image: string;
    is_primary: boolean;
    order: number;
};

export type BlogT = {
    id: number;
    title: string;
    color: string;
    description: string | null;
    is_published: boolean;
    images: BlogImage[];
    tags: TagT[];
} & TimestampsT;

export type FaqT = {
    id: number;
    question: string;
    answer: string;
    color: string;
    is_published: boolean;
} & TimestampsT;

export type CompanyPolicyT = {
    id: number;
    mission: string;
    vision: string;
    core_values: string;
    terms_and_conditions: string;
} & TimestampsT;

export type TeamMemberT = {
    id: number;
    name: string;
    designation: string;
    mascot_image: string;
    email?: string;
    phone?: string;
    social_links?: string;
    image?: string;
    color?: string;
    is_active: boolean;
} & TimestampsT;

interface CommonPaginationT<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
}

export interface ChunkUploadHook {
    isUploading: boolean;
    progress: number;
    abort: () => void;
    upload: (options: {
        url: string;
        file: File;
        onProgress: (progress: UploadProgress) => void;
        onComplete: (response: any) => void;
        onError: (error: any) => void;
    }) => void;
}
