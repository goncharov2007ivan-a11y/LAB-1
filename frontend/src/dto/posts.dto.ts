export interface PostViewDto {
    id: string;
    title: string;
    category: string;
    content: string;
    author: string;
    authorId: number;
    date: string;
}

export interface CreatePostDto {
    title: string;
    category: string;
    content: string;
    authorId: number; 
}

export type UpdatePostDto = Partial<CreatePostDto>;