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
exports.postUnreactPost = exports.postDislikePost = exports.postLikePost = exports.getUserPosts = exports.getAllFriendsPosts = exports.getLastPublishedPost = exports.postPost = void 0;
const models_1 = require("../models");
const postPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author = req.body.author;
    const content = req.body.content;
    const date = req.body.date;
    const timestamp = req.body.timestamp;
    const user = yield models_1.UserModel.findOne({ email: author }, { username: 1 });
    if (!user)
        return res.status(400).json("There has been an error within your request");
    const post = new models_1.PostModel({
        author: author,
        username: user.username,
        content: content,
        date: date,
        timestamp: timestamp,
        likes: [],
        dislikes: [],
    });
    const savedPost = yield post.save();
    res.status(201).json({ post: savedPost, status: 0 });
});
exports.postPost = postPost;
const getLastPublishedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorEmail = req.query.user;
    if (!authorEmail)
        return res.status(404).json("There has been an error in the request");
    const lastPost = yield models_1.PostModel.find({ author: authorEmail }).sort({ timestamp: -1 }).limit(1);
    const author = yield models_1.UserModel.findOne({ email: authorEmail }, { avatar: 1 });
    const authorAvatar = author ? author.avatar : "/img/default-avatar.png";
    lastPost[0].likes.push("0");
    lastPost[0].dislikes.push("0");
    res.status(200).json({ post: lastPost[0], status: 0, authorAvatar: authorAvatar });
});
exports.getLastPublishedPost = getLastPublishedPost;
const getPostsFromFriendlist = (friendlist, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const postsToShow = [];
    for (let f = 0; f < friendlist.length; f++) {
        const friendPosts = yield models_1.PostModel.find({ author: friendlist[f] }, { __v: 0 });
        const friendAvatar = yield models_1.UserModel.findOne({ email: friendlist[f] }, { avatar: 1, _id: 0 });
        let authorAvatar = "/img/default-avatar.png";
        if (friendAvatar)
            authorAvatar = friendAvatar.avatar;
        for (let p = 0; p < friendPosts.length; p++) {
            let status = 0;
            const liked = friendPosts[p].likes.find((user) => user == userEmail);
            const disliked = friendPosts[p].dislikes.find((user) => user == userEmail);
            if (liked) {
                status = 1;
            }
            else if (disliked) {
                status = 2;
            }
            postsToShow.push({ post: friendPosts[p], status: status, authorAvatar: authorAvatar });
        }
    }
    return postsToShow;
});
const getAllFriendsPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.query.user) === null || _a === void 0 ? void 0 : _a.toString();
    if (!userEmail)
        return res.status(400).json("There has been an error in the request");
    const usersFriendlist = yield models_1.UserModel.findOne({ email: userEmail }, { friendlist: 1, _id: 0 });
    if (!usersFriendlist)
        return res.status(400).json("There has been an error in the request");
    const postsToShow = yield getPostsFromFriendlist(usersFriendlist.friendlist, userEmail);
    postsToShow.sort((a, b) => a.post.timestamp - b.post.timestamp);
    return res.status(200).json(postsToShow);
});
exports.getAllFriendsPosts = getAllFriendsPosts;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const profileEmail = (_b = req.query.profileEmail) === null || _b === void 0 ? void 0 : _b.toString();
    const userEmail = (_c = req.query.userEmail) === null || _c === void 0 ? void 0 : _c.toString();
    if (!profileEmail || !userEmail)
        return res.status(401).json("There has been an error in the request");
    const posts = yield getPostsFromFriendlist([profileEmail], userEmail);
    res.status(200).json(posts);
});
exports.getUserPosts = getUserPosts;
const postLikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.body.postId;
        const likerEmail = req.body.liker;
        const likes = req.body.likes;
        const dislikes = req.body.dislikes;
        if (!postId || !likerEmail)
            return res.status(400).json("There has been an error in the request");
        if (Number(likes) < 1)
            yield models_1.PostModel.findOneAndUpdate({ _id: postId }, { likes: [likerEmail] });
        else {
            yield models_1.PostModel.findOneAndUpdate({ _id: postId }, { $addToSet: { likes: likerEmail } });
        }
        if (Number(dislikes) >= 1)
            yield models_1.PostModel.findOneAndUpdate({ _id: postId }, { $pull: { dislikes: likerEmail } });
        const post = yield models_1.PostModel.findOne({ _id: postId }, { __v: 0 });
        if (!post)
            return res.status(400).json("There has been an error in the request");
        const totalLikes = post.likes.length++;
        const totalDislikes = post.dislikes[0] == "0" ? 0 : post.dislikes.length;
        res.status(201).json({ likes: totalLikes, dislikes: totalDislikes });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.postLikePost = postLikePost;
const postDislikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.body.postId;
        const dislikerEmail = req.body.disliker;
        const likes = req.body.likes;
        const dislikes = req.body.dislikes;
        if (!postId || !dislikerEmail)
            return res.status(400).json("There has been an error in the request");
        if (Number(dislikes) < 1)
            yield models_1.PostModel.findOneAndUpdate({ _id: postId }, { dislikes: [dislikerEmail] });
        else {
            yield models_1.PostModel.findOneAndUpdate({ _id: postId }, { $addToSet: { dislikes: dislikerEmail } });
        }
        if (Number(likes) >= 1)
            yield models_1.PostModel.findOneAndUpdate({ _id: postId }, { $pull: { likes: dislikerEmail } });
        const post = yield models_1.PostModel.findOne({ _id: postId }, { __v: 0 });
        if (!post)
            return res.status(400).json("There has been an error in the request");
        const totalLikes = post.likes[0] == "0" ? 0 : post.likes.length;
        const totalDislikes = post.dislikes.length++;
        res.status(201).json({ likes: totalLikes, dislikes: totalDislikes });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.postDislikePost = postDislikePost;
const postUnreactPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.body.postId;
        const unreacterEmail = req.body.disliker;
        const reaction = req.body.reaction;
        if (!postId || !unreacterEmail)
            return res.status(400).json("There has been an error in the request");
        if (reaction === "like")
            yield models_1.PostModel.findOneAndUpdate({ _id: postId }, { $pull: { likes: unreacterEmail } });
        if (reaction === "dislike")
            yield models_1.PostModel.findOneAndUpdate({ _id: postId }, { $pull: { dislikes: unreacterEmail } });
        const post = yield models_1.PostModel.findOne({ _id: postId }, { __v: 0 });
        if (!post)
            return res.status(400).json("There has been an error in the request");
        const totalLikes = post.likes.length;
        const totalDislikes = post.dislikes.length;
        res.status(201).json({ likes: totalLikes, dislikes: totalDislikes });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.postUnreactPost = postUnreactPost;
//# sourceMappingURL=post.controller.js.map