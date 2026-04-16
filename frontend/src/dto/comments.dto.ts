export interface CommentViewDto {
  id: string;
  text: string;
  author: string;
  postId: string;
  date: string;
}

export interface CreateCommentDto {
    text: string;
    authorId: string;
    postId: number;
}

export interface UpdateCommentDto {
    text?: string;
}