import { Request, Response } from "express";
import { UserModel } from "../models";
import { IUser } from "../interfaces";

import jwt from "jsonwebtoken";

export const postSignUp = async (req: Request, res: Response) => {
    const exists = await UserModel.findOne({email: req.body.email});
    if(exists) return res.status(403).json("User already exists");
    // Creando usuario
    const user: IUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        friendlist: [req.body.email],
        followers: [],
        avatar: "/img/avatar/default-avatar.png",
    });
    user.password = await user.encryptPassword(user.password);
    // Guardando usuario
    const savedUser = await user.save();

    // Creando token
    const token: string = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET || "azurillTest");
    // Guardar en cookies
    res.cookie("auth-token", token, { maxAge: 24 * 60 * 60 * 1000 });
    const userInfo = {
        username: user.username,
        email: user.email,
    }
    res.cookie("userInfo", userInfo, { maxAge: 24 * 60 * 60 * 1000 });
    // Responder al cliente
    res.redirect("../../main");
};

export const postSignIn = async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(403).json("Email or password wrong");
    const passOk: boolean = await user.validatePassword(req.body.password);
    if (!passOk) return res.status(403).json("Email or password wrong");
    const token: string = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET || "azurillTest", {
        expiresIn: 60 * 60 * 24,
    });
    res.cookie("auth-token", token, { maxAge: 24 * 60 * 60 * 1000 });
    const userInfo = {
        username: user.username,
        email: user.email,
    }
    res.cookie("userInfo", userInfo, { maxAge: 24 * 60 * 60 * 1000 });
    res.redirect("../../main");
};

export const postLogOut = (req: Request, res: Response) => {
    res.clearCookie("userInfo");
    res.clearCookie("auth-token");
    res.redirect("../../signin");
};
