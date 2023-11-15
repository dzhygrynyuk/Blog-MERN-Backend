import express from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from "mongoose";

import { registerValidation, loginValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";
import checkAuth from './middlewares/checkAuth.js';
import UserController from "./controllers/UserController.js";
import PostController from "./controllers/PostController.js";

const app = express();

dotenv.config();
app.use(express.json());

const UserCtrl = new UserController();
const PostCtrl = new PostController();

mongoose
    .connect(`mongodb+srv://dzhygrynyuk:${process.env.MONGODB_PASS}@cluster0.tmndkp7.mongodb.net/Blog-MERN?retryWrites=true&w=majority`)
    .then(() => console.log('Success connected!!!'))
    .catch((err) => console.log('DB error', err));

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.post('/auth/register', registerValidation, UserCtrl.registration);
app.post('/auth/login', loginValidation, UserCtrl.login);
app.get('/auth/me', checkAuth, UserCtrl.getMe);

app.get('/posts', PostCtrl.getAll);
app.get('/posts/:id', PostCtrl.getItem);
app.post('/posts', checkAuth, postCreateValidation, PostCtrl.create);
app.delete('/posts/:id', checkAuth, PostCtrl.remove);
app.patch('/posts/:id', checkAuth, PostCtrl.update);

app.listen(process.env.PORT, (error) => {
    if(error){
        return console.log(error);
    }

    console.log(`Server running on post ${process.env.PORT}`);
});