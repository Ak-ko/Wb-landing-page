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
    year: string | null;
    industry_type: string | null;
    project_keywords: string | null;
    project_scopes: string | null;
    project_link: string | null;
    is_published: boolean;
    tags: TagT[];
    images: BrandingProjectImageT[];
    members: TeamMemberT[];
} & TimestampsT;

export type BrandingProjectMemberT = {
    id: number;
    branding_project_id: number | null;
    team_member_id: number;
    is_lead: boolean;
    team_member?: TeamMemberT;
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
    readingTime: number | null;
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
    bio?: string;
    is_active: boolean;
    pivot: BrandingProjectMemberT;
} & TimestampsT;

export type BusinessPackageT = {
    id: number;
    name: string;
    description: string | null;
    price_text: string | null;
    price: number | null;
    currency: string | null;
    duration: string | null;
    revision_remarks: string | null;
    color: string;
    is_recommended: boolean;
    business_package_items: BusinessPackageItemT[];
    brand_guideline: BusinessBrandGuidelineT;
    business_brand_guideline_id: number;
} & WithModifiedBusienessPackageItemsT &
    TimestampsT;

export type WithModifiedBusienessPackageItemsT = {
    all_items: {
        id: number;
        name: string;
        is_included: boolean;
    }[];
};

export type BusinessPackageAddonT = {
    id: number;
    name: string;
    price_text: string;
    price: number | null;
    currency: string;
    revision_remarks: string | null;
} & TimestampsT;

export type BusinessPackageItemT = {
    id: number;
    name: string;
    business_package_id: number;
} & TimestampsT;

export type MascortArtT = {
    id: number;
    title: string;
    description: string;
    images: {
        id: number;
        image: string;
        is_primary: boolean;
        is_mascot: boolean;
    }[];
} & TimestampsT;

export type ArtPackageT = {
    id: number;
    title: string;
    description: string;
    type: string;
    color: string;
    items: ArtPackageItemT[];
    prices: ArtPackagePriceT[];
} & TimestampsT;

export type ArtPackageItemT = {
    id: number;
    item: string;
    art_package_id: number;
} & TimestampsT;

export type ArtPackagePriceT = {
    id: number;
    price: number;
    duration: string;
    art_package_id: number;
} & TimestampsT;

export type IllustrationArtT = {
    id: number;
    title: string;
    description: string | null;
    images: IllustrationArtImageT[];
} & TimestampsT;

export type IllustrationArtImageT = {
    id: number;
    image: string;
    is_primary: boolean;
} & TimestampsT;

export type ComicArtT = {
    id: number;
    title: string;
    description: string | null;
    images: ComicArtImageT[];
} & TimestampsT;

export type ComicArtImageT = {
    id: number;
    image: string;
    is_primary: boolean;
} & TimestampsT;

export type StickerArtT = {
    id: number;
    title: string;
    description: string | null;
    images: ComicArtImageT[];
} & TimestampsT;

export type StickerArtImageT = {
    id: number;
    image: string;
    is_primary: boolean;
} & TimestampsT;

export type AnimationAndMotionT = {
    id: number;
    title: string;
    description: string | null;
    images: AnimationAndMotionImageT[];
} & TimestampsT;

export type AnimationAndMotionImageT = {
    id: number;
    image: string;
    is_primary: boolean;
} & TimestampsT;
export type BrandGuidelineElementItemT = {
    id: number;
    brand_guideline_element_id: number;
    title: string;
    order: number | null;
    created_at: string;
    updated_at: string;
};

export type BrandGuidelineElementT = {
    id: number;
    business_brand_guideline_id: number;
    title: string;
    order: number | null;
    items: BrandGuidelineElementItemT[];
    created_at: string;
    updated_at: string;
};

export type BusinessBrandGuidelineT = {
    id: number;
    title: string;
    description: string | null;
    elements: BrandGuidelineElementT[];
    created_at: string;
    updated_at: string;
};

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
