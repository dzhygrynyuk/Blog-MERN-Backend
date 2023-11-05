import express from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from "mongoose";

const app = express();

dotenv.config();
app.use(express.json());

mongoose
    .connect(`mongodb+srv://dzhygrynyuk:${process.env.MONGODB_PASS}@cluster0.tmndkp7.mongodb.net/Blog-MERN?retryWrites=true&w=majority`)
    .then(() => console.log('Success connected!!!'))
    .catch((err) => console.log('DB error', err));

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.post('/auth/login', (req, res) => {
    if(req.body.email === 'test@ts.ts'){
        const token = jwt.sign(
            {
                email: req.body.email,
                fullname: req.body.fullname,
            },
            process.env.JWT_SECRET || "",
            {
                expiresIn: process.env.JWT_MAX_AGE,
                algorithm: "HS256"
            }
        );

        res.json({
            success: true,
            token
        });
    }
});

app.listen(process.env.PORT, (error) => {
    if(error){
        return console.log(error);
    }

    console.log(`Server running on post ${process.env.PORT}`);
});