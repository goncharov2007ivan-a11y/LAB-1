export interface PostViewDto {
    id: string;
    title: string;
    category: string;
    content: string;
    authorName: string;
    date: string;
}

export interface CreatePostDto {
    title: string;
    category: string;
    content: string;
    authorId: number; 
}

export type UpdatePostDto = Partial<CreatePostDto>;