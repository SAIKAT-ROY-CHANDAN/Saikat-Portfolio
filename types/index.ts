export interface IBlog {
    _id: string
    title: string;
    tags?: string[];
    content: string;
    coverImage?: string | null;
    createdAt?: Date;
}

export interface IProject {
    id: number;
    title: string;
    des: string;
    img: string;
    iconLists: string[];
    link: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WorkExperience {
    id: number;
    title: string;
    desc: string;
    className: string;
    thumbnail: string
    createdAt?: Date;
    updatedAt?: Date;
}
  