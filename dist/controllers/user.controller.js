"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postChangeUserAvatar = exports.getUserProfile = exports.postAddFriend = exports.getUsersNotFollowed = exports.getMain = exports.getSignIn = exports.getSignUp = void 0;
const models_1 = require("../models");
const getSignUp = (req, res) => {
    res.render("signup");
};
exports.getSignUp = getSignUp;
const getSignIn = (req, res) => {
    res.render("signin");
};
exports.getSignIn = getSignIn;
const getMain = (req, res) => {
    const userInfo = req.cookies["userInfo"];
    res.render("main", { user: userInfo });
};
exports.getMain = getMain;
const getUsersNotFollowed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.query.user;
        const user = yield models_1.UserModel.findOne({ email: userEmail }, { _id: 0, __v: 0 });
        if (!user)
            return res.status(400).json("User not found");
        const users = yield models_1.UserModel.find({ email: { $ne: user.email }, followers: { $nin: user.email } }, { username: 1, email: 1, _id: 1 });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getUsersNotFollowed = getUsersNotFollowed;
const postAddFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.body.userEmail;
        const friendEmail = req.body.friendEmail;
        if (!userEmail || !friendEmail)
            return res.status(400).json("There has been an error in the request");
        yield models_1.UserModel.findOneAndUpdate({ email: userEmail }, { $addToSet: { friendlist: friendEmail } });
        yield models_1.UserModel.findOneAndUpdate({ email: friendEmail }, { $addToSet: { followers: userEmail } });
        return res.status(200).json({ addedFriend: friendEmail });
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
exports.postAddFriend = postAddFriend;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.params.useremail;
        if (!userEmail)
            return res.status(404).json("Invalid request");
        const profileInfo = yield models_1.UserModel.findOne({ email: userEmail }, { password: 0, __v: 0 });
        if (!profileInfo)
            return res.status(404).json("User not found");
        const userInfo = req.cookies["userInfo"];
        if (userEmail === userInfo.email)
            res.status(200).render("ownProfile", { user: userInfo, profile: profileInfo });
        else
            res.status(200).render("user", { user: userInfo, profile: profileInfo });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
exports.getUserProfile = getUserProfile;
const postChangeUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.body.userEmail;
        const newAvatar = req.body.avatar;
        if (!userEmail || !newAvatar)
            return res.status(401).json("Bad request");
        const profile = yield models_1.UserModel.findOneAndUpdate({ email: userEmail }, { avatar: newAvatar });
        if (!profile)
            return res.status(401).json("User not found");
        return res.status(201).json(profile.avatar);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
exports.postChangeUserAvatar = postChangeUserAvatar;
//# sourceMappingURL=user.controller.js.map