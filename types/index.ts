export type SourcePlatform = 'native' | 'linkedin' | 'facebook' | 'x';

export interface IBlog {
    _id: string
    title: string;
    tags?: string[];
    content: string;
    coverImage?: string | null;
    createdAt?: Date;
    sourceUrl?: string;
    sourcePlatform?: SourcePlatform;
    authorName?: string;
    authorHandle?: string;
    authorAvatar?: string;
    sourceText?: string;
    postedAt?: string | Date;
}

export interface IProject {
    id: number;
    title: string;
    des: string;
    img: string;
    iconLists: string[];
    link: string;
    priority?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WorkExperience {
    id: number;
    title: string;
    desc: string;
    className: string;
    thumbnail: string
    period?: string;
    company?: string;
    place?: string;
    priority?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
  