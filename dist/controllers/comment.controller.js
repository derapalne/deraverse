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
exports.postUnreactComment = exports.postDislikeComment = exports.postLikeComment = exports.getCommentsFromPost = exports.postPostComment = void 0;
const models_1 = require("../models");
const postPostComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = req.body.author;
        const user = yield models_1.UserModel.findOne({ email: author }, { _id: 0 });
        if (!user)
            return res.status(400).json("Bad request");
        const content = req.body.content;
        const date = req.body.date;
        const timestamp = req.body.timestamp;
        const idFromPost = req.body.idFromPost;
        const comment = new models_1.CommentModel({
            author: author,
            username: user.username,
            content: content,
            date: date,
            timestamp: timestamp,
            idFromPost: idFromPost,
            likes: [],
            dislikes: [],
        });
        const savedComment = yield comment.save();
        res.status(201).json({ comment: savedComment, status: 0, authorAvatar: user.avatar });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.postPostComment = postPostComment;
const getCommentsFromPost = (postId, userEmail, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield models_1.CommentModel.find({ idFromPost: postId, timestamp: { $lte: timestamp } }, { _id: 0, __v: 0 });
        const commentsToReturn = [];
        for (let c = 0; c < comments.length; c++) {
            const commenterInfo = yield models_1.UserModel.findOne({ email: comments[c].author }, { avatar: 1, _id: 0 });
            let authorAvatar = "/img/default-avatar.png";
            if (commenterInfo)
                authorAvatar = commenterInfo.avatar;
            let status = 0;
            const liked = comments[c].likes.find((user) => user == userEmail);
            if (liked)
                status = 1;
            else {
                const disliked = comments[c].dislikes.find((user) => user == userEmail);
                if (disliked)
                    status = 2;
            }
            commentsToReturn.push({
                comment: comments[c],
                status: status,
                authorAvatar: authorAvatar,
            });
        }
        return commentsToReturn;
    }
    catch (error) {
        console.log(error);
        return [];
    }
});
exports.getCommentsFromPost = getCommentsFromPost;
const postLikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.body.postId;
        const likerEmail = req.body.liker;
        const likes = req.body.likes;
        const dislikes = req.body.dislikes;
        if (!postId || !likerEmail)
            return res.status(400).json("There has been an error in the request");
        if (Number(likes) < 1)
            yield models_1.CommentModel.findOneAndUpdate({ _id: postId }, { likes: [likerEmail] });
        else {
            yield models_1.CommentModel.findOneAndUpdate({ _id: postId }, { $addToSet: { likes: likerEmail } });
        }
        if (Number(dislikes) >= 1)
            yield models_1.CommentModel.findOneAndUpdate({ _id: postId }, { $pull: { dislikes: likerEmail } });
        const post = yield models_1.CommentModel.findOne({ _id: postId }, { __v: 0 });
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
exports.postLikeComment = postLikeComment;
const postDislikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.body.postId;
        const dislikerEmail = req.body.disliker;
        const likes = req.body.likes;
        const dislikes = req.body.dislikes;
        if (!postId || !dislikerEmail)
            return res.status(400).json("There has been an error in the request");
        if (Number(dislikes) < 1)
            yield models_1.CommentModel.findOneAndUpdate({ _id: postId }, { dislikes: [dislikerEmail] });
        else {
            yield models_1.CommentModel.findOneAndUpdate({ _id: postId }, { $addToSet: { dislikes: dislikerEmail } });
        }
        if (Number(likes) >= 1)
            yield models_1.CommentModel.findOneAndUpdate({ _id: postId }, { $pull: { likes: dislikerEmail } });
        const post = yield models_1.CommentModel.findOne({ _id: postId }, { __v: 0 });
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
exports.postDislikeComment = postDislikeComment;
const postUnreactComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.body.postId;
        const unreacterEmail = req.body.disliker;
        const reaction = req.body.reaction;
        if (!postId || !unreacterEmail)
            return res.status(400).json("There has been an error in the request");
        if (reaction === "like")
            yield models_1.CommentModel.findOneAndUpdate({ _id: postId }, { $pull: { likes: unreacterEmail } });
        if (reaction === "dislike")
            yield models_1.CommentModel.findOneAndUpdate({ _id: postId }, { $pull: { dislikes: unreacterEmail } });
        const post = yield models_1.CommentModel.findOne({ _id: postId }, { __v: 0 });
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
exports.postUnreactComment = postUnreactComment;
//# sourceMappingURL=comment.controller.js.map