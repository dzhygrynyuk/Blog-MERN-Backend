import { body } from "express-validator";

export const postCreateValidation = [
    body('title', 'Input title of post').isLength({min: 3}).isString(),
    body('text', 'Input text of post').isLength({min: 3}).isString(),
    body('tags', 'Invalid tag format').optional().isString(),
    body('avatarUrl', 'Invalid image link').optional().isURL()
];