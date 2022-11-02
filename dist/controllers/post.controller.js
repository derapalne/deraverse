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
const comment_controller_1 = require("./comment.controller");
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
    const lastPost = yield models_1.PostModel.findOne({ author: authorEmail }).sort({ timestamp: -1 }).limit(1);
    const author = yield models_1.UserModel.findOne({ email: authorEmail }, { avatar: 1 });
    const authorAvatar = author ? author.avatar : "/img/default-avatar.png";
    if (!lastPost)
        return res.status(500).json("Couldnt retrieve post");
    lastPost.likes.push("0");
    lastPost.dislikes.push("0");
    const postToSend = {
        post: {
            content: lastPost,
            comments: []
        },
        status: 0,
        authorAvatar: authorAvatar
    };
    res.status(200).json(postToSend);
});
exports.getLastPublishedPost = getLastPublishedPost;
const getPostsFromFriendlist = (friendlist, userEmail, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    // Crear el array donde van a estar los posts
    const postsToShow = [];
    // Por cada item del array de amigos, siempre y cuando sean menos de diez posts
    let index = 0;
    const publishedPostsIds = [];
    while (index < 10) {
        // Buscá los posts de cada amigo de la lista
        const friendPosts = yield models_1.PostModel.find({ author: { $in: friendlist }, timestamp: { $lt: timestamp } }, { __v: 0 })
            .sort("-timestamp")
            .limit(10);
        if (friendPosts.length == 0)
            break;
        for (let p = 0; p < friendPosts.length; p++) {
            let status = 0;
            const liked = friendPosts[p].likes.find((user) => user == userEmail);
            const disliked = friendPosts[p].dislikes.find((user) => user == userEmail);
            if (liked)
                status = 1;
            else if (disliked) {
                status = 2;
            }
            // Traé su avatar
            const friendAvatar = yield models_1.UserModel.findOne({ email: friendPosts[p].author }, { avatar: 1, _id: 0 });
            let authorAvatar = "/img/default-avatar.png";
            if (friendAvatar)
                authorAvatar = friendAvatar.avatar;
            const comments = yield (0, comment_controller_1.getCommentsFromPost)(`${friendPosts[p].author}-${friendPosts[p].timestamp}`, userEmail, Date.now());
            const wasPublished = publishedPostsIds.find((id) => id == friendPosts[p].id);
            if (wasPublished) {
                index = 10;
                continue;
            }
            else
                publishedPostsIds.push(friendPosts[p].id);
            postsToShow.push({
                post: { content: friendPosts[p], comments: comments },
                status: status,
                authorAvatar: authorAvatar,
            });
            index++;
            if (index >= 10)
                break;
        }
        if (index >= 10)
            break;
    }
    return postsToShow;
});
const getAllFriendsPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const timestamp = (_a = req.query.timestamp) === null || _a === void 0 ? void 0 : _a.toString();
    const userEmail = (_b = req.query.user) === null || _b === void 0 ? void 0 : _b.toString();
    if (!userEmail || !timestamp)
        return res.status(400).json("There has been an error in the request");
    const usersFriendlist = yield models_1.UserModel.findOne({ email: userEmail }, { friendlist: 1, _id: 0 });
    if (!usersFriendlist)
        return res.status(400).json("There has been an error in the request");
    const postsToShow = yield getPostsFromFriendlist(usersFriendlist.friendlist, userEmail, parseInt(timestamp));
    if (postsToShow.length > 0)
        return res.status(200).json(postsToShow);
    else
        return res.status(200).json(false);
});
exports.getAllFriendsPosts = getAllFriendsPosts;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    const profileEmail = (_c = req.query.profileEmail) === null || _c === void 0 ? void 0 : _c.toString();
    const userEmail = (_d = req.query.userEmail) === null || _d === void 0 ? void 0 : _d.toString();
    const timestamp = (_e = req.query.timestamp) === null || _e === void 0 ? void 0 : _e.toString();
    if (!profileEmail || !userEmail || !timestamp)
        return res.status(403).json("There has been an error in the request");
    const posts = yield getPostsFromFriendlist([profileEmail], userEmail, parseInt(timestamp));
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