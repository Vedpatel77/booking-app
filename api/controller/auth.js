import User from "../models/User.js"
import bcrypt from 'bcrypt';
import { createError } from '../utils/error.js';
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashPassword;

        const newUser = new User(req.body);
        await newUser.save()
        res.status(200).json("user created Successfully!");
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, "User not found!"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordCorrect) return next(createError(400, "Wrong password or username!"));

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_TOKEN);

        const { password, isAdmin, ...otherDeatils } = user._doc;

        res.cookie("access_token",token,{
            httpOnly:true,
        }).status(200).json({ ...otherDeatils });
    } catch (error) {
        next(error)
    }
}