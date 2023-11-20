import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { registerValidation, loginValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";
import checkAuth from './middlewares/checkAuth.js';
import handleValidationErrors from './middlewares/handleValidationErrors.js';
import UserController from "./controllers/UserController.js";
import PostController from "./controllers/PostController.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });


const UserCtrl = new UserController();
const PostCtrl = new PostController();

mongoose
    .connect(`mongodb+srv://dzhygrynyuk:${process.env.MONGODB_PASS}@cluster0.tmndkp7.mongodb.net/Blog-MERN?retryWrites=true&w=majority`)
    .then(() => console.log('Success connected!!!'))
    .catch((err) => console.log('DB error', err));

app.post('/auth/register', registerValidation, handleValidationErrors, UserCtrl.registration);
app.post('/auth/login', loginValidation, handleValidationErrors, UserCtrl.login);
app.get('/auth/me', checkAuth, UserCtrl.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
app.get('/tags', PostCtrl.getLastTags);

app.get('/posts', PostCtrl.getAll);
app.get('/posts/:id', PostCtrl.getItem);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostCtrl.create);
app.delete('/posts/:id', checkAuth, PostCtrl.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostCtrl.update);

app.listen(process.env.PORT, (error) => {
    if(error){
        return console.log(error);
    }

    console.log(`Server running on post ${process.env.PORT}`);
});