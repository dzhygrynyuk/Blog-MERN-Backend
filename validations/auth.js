import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'The password must be at least 5 characters long').isLength({min: 5}),
    body('fullname', 'The name must be at least 3 characters long').isLength({min: 3}),
    body('avatarUrl', 'Invalid avatar link').optional().isURL()
];

export const  loginValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'The password must be at least 5 characters long').isLength({min: 5})
];