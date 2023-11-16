import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";

class UserController {
    async registration(req, res){
        try {
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

    async login(req, res){
        try {
            const user = await UserModel.findOne({ email: req.body.email });

            if(!user){
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

            if(!isValidPass){
                return res.status(400).json({
                    message: 'Incorrect login or password'
                });
            }

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
            res.status(404).json({
                message: 'Failed to login'
            });
        }
    }

    async getMe(req, res){
        try {
            const user = await UserModel.findById(req.userId);

            if(!user){
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const { passwordHash, ...userData } = user._doc;

            res.json(userData);
        } catch (error) {
            console.log(error);
        }
    }
}

export default UserController;