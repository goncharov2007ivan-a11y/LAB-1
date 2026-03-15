import type { Request, Response } from "express";
import { postsService } from "../services/posts.service.js";
export const postsController = {
getAll: (req: Request, res: Response): void => {
    const posts = postsService.getAll();
    res.status(200).json(posts);
},
getById: (req: Request, res: Response): void => {
    const id = req.params.id as string;
    const post = postsService.getById(id);
    if (!post) {
        res.status(404).json({message: 'Не знайдено'});
        return;
    }
    res.status(200).json(post);
},
create: (req: Request, res: Response): void => {
    const dto = req.body;
    const newPost = postsService.create(dto);
    res.status(201).json(newPost);
},
update: (req: Request, res: Response): void => {
    const id = req.params.id as string;
    const dto = req.body;
    const updatedPost = postsService.update(id, dto);
    if (!updatedPost) {
        res.status(404).json({massage: 'Не знайдено'});
        return;
    }
    res.status(200).json(updatedPost);
},
delete: (req: Request, res: Response): void => {
    const id = req.params.id as string;
    const isDeleted = postsService.delete(id);
    if (!isDeleted) {
        res.status(404).json({massage: 'Не знайдено'});
        return;
    }
    res.status(200).json(isDeleted);
}
}