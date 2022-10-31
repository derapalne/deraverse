import { Request, Response } from "express";
import { UserModel } from "../models";

export const getSignUp = (req: Request, res: Response) => {
    res.render("signup");
};

export const getSignIn = (req: Request, res: Response) => {
    res.render("signin");
};

export const getMain = (req: Request, res: Response) => {
    const userInfo = req.cookies["userInfo"];
    res.render("main", { user: userInfo });
};

export const getUsersNotFollowed = async (req: Request, res: Response) => {
    try {
        const userEmail = req.query.user;
        const user = await UserModel.findOne({ email: userEmail }, { _id: 0, __v: 0 });
        if (!user) return res.status(400).json("User not found");
        const users = await UserModel.find(
            { email: { $ne: user.email }, followers: { $nin: user.email } },
            { username: 1, email: 1, _id: 1 }
        );
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const postAddFriend = async (req: Request, res: Response) => {
    try {
        const userEmail = req.body.userEmail;
        const friendEmail = req.body.friendEmail;
        if (!userEmail || !friendEmail)
            return res.status(400).json("There has been an error in the request");
        await UserModel.findOneAndUpdate(
            { email: userEmail },
            { $addToSet: { friendlist: friendEmail } }
        );
        await UserModel.findOneAndUpdate(
            { email: friendEmail },
            { $addToSet: { followers: userEmail } }
        );
        return res.status(200).json({ addedFriend: friendEmail });
    } catch (e) {
        return res.status(500).json(e);
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userEmail = req.params.useremail;
        if (!userEmail) return res.status(404).json("Invalid request");
        const profileInfo = await UserModel.findOne({ email: userEmail }, { password: 0, __v: 0 });
        if (!profileInfo) return res.status(404).json("User not found");
        const userInfo = req.cookies["userInfo"];
        if(userEmail === userInfo.email) res.status(200).render("ownProfile", {user: userInfo, profile: profileInfo});
        else res.status(200).render("user", { user: userInfo, profile: profileInfo });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

export const postChangeUserAvatar = async (req: Request, res: Response) => {
    try {
        const userEmail = req.body.userEmail;
        const newAvatar = req.body.avatar;
        if(!userEmail || !newAvatar) return res.status(401).json("Bad request");
        const profile = await UserModel.findOneAndUpdate({email: userEmail}, {avatar: newAvatar});
        if(!profile) return res.status(401).json("User not found");
        return res.status(201).json(profile.avatar);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}