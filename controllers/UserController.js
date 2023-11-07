import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";

class UserController{
    async registration(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json(errors.array());
            }

            const password = req.body.password;
            const salt = await bcrypt.genSalt(7);
            const hash = await bcrypt.hash(password, salt);

            const doc = new UserModel({
                email: req.body.email,
                fullname: req.body.fullname,
                avatarUrl: req.body.avatarUrl,
                passwordHash: hash
            });

            const user = await doc.save();

            const token = jwt.sign(
                {
                    _id: user._id
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: '7d'
                }
            );

            const { passwordHash, ...userData } = user._doc;

            res.json({
                ...userData,
                token
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Registration error'
            });
        }
    }
}

export default UserController;