export interface IBlog {
    title: string;
    tags?: string[];
    content: string;
    coverImage?: string | null;
    createdAt?: Date;
}
  