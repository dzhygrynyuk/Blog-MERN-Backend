import express from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from "mongoose";

import { registerValidations } from "./validations/auth.js";
import UserController from "./controllers/UserController.js";

const app = express();

dotenv.config();
app.use(express.json());

const UserCtrl = new UserController();

mongoose
    .connect(`mongodb+srv://dzhygrynyuk:${process.env.MONGODB_PASS}@cluster0.tmndkp7.mongodb.net/Blog-MERN?retryWrites=true&w=majority`)
    .then(() => console.log('Success connected!!!'))
    .catch((err) => console.log('DB error', err));

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.post('/auth/register', registerValidations, UserCtrl.registration);
app.post('/auth/login', registerValidations, UserCtrl.login);

app.listen(process.env.PORT, (error) => {
    if(error){
        return console.log(error);
    }

    console.log(`Server running on post ${process.env.PORT}`);
});