import { Request, Response } from "express";
import { IComment } from "interfaces";
import { CommentModel, UserModel } from "../models";

export const postPostComment = async (req: Request, res: Response) => {
    try {
        const author = req.body.author;
        const user = await UserModel.findOne({ email: author }, { _id: 0 });
        if (!user) return res.status(400).json("Bad request");
        const content = req.body.content;
        const date = req.body.date;
        const timestamp = req.body.timestamp;
        const idFromPost = req.body.idFromPost;
        const comment: IComment = new CommentModel({
            author: author,
            username: user.username,
            content: content,
            date: date,
            timestamp: timestamp,
            idFromPost: idFromPost,
            likes: [],
            dislikes: [],
        });
        const savedComment = await comment.save();
        res.status(201).json({ comment: savedComment, status: 0, authorAvatar: user.avatar });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const getCommentsFromPost = async (
    postId: string,
    userEmail: string,
    timestamp: number
): Promise<{ comment: IComment; status: number; authorAvatar: string }[]> => {
    try {
        const comments = await CommentModel.find(
            { idFromPost: postId, timestamp: { $lte: timestamp } },
            { _id: 0, __v: 0 }
        );
        const commentsToReturn: { comment: IComment; status: number; authorAvatar: string }[] = [];
        for (let c = 0; c < comments.length; c++) {
            const commenterInfo = await UserModel.findOne(
                { email: comments[c].author },
                { avatar: 1, _id: 0 }
            );
            let authorAvatar = "/img/default-avatar.png";
            if (commenterInfo) authorAvatar = commenterInfo.avatar;
            let status = 0;
            const liked = comments[c].likes.find((user) => user == userEmail);
            if (liked) status = 1;
            else {
                const disliked = comments[c].dislikes.find((user) => user == userEmail);
                if (disliked) status = 2;
            }
            commentsToReturn.push({
                comment: comments[c],
                status: status,
                authorAvatar: authorAvatar,
            });
        }
        return commentsToReturn;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const postLikeComment = async (req: Request, res: Response) => {
    try {
        const postId = req.body.postId;
        const likerEmail = req.body.liker;
        const likes = req.body.likes;
        const dislikes = req.body.dislikes;
        if (!postId || !likerEmail)
            return res.status(400).json("There has been an error in the request");
        if (Number(likes) < 1)
            await CommentModel.findOneAndUpdate({ _id: postId }, { likes: [likerEmail] });
        else {
            await CommentModel.findOneAndUpdate({ _id: postId }, { $addToSet: { likes: likerEmail } });
        }
        if (Number(dislikes) >= 1)
            await CommentModel.findOneAndUpdate({ _id: postId }, { $pull: { dislikes: likerEmail } });
        const post = await CommentModel.findOne({ _id: postId }, { __v: 0 });
        if (!post) return res.status(400).json("There has been an error in the request");
        const totalLikes = post.likes.length++;
        const totalDislikes = post.dislikes[0] == "0" ? 0 : post.dislikes.length;
        res.status(201).json({ likes: totalLikes, dislikes: totalDislikes });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const postDislikeComment = async (req: Request, res: Response) => {
    try {
        const postId = req.body.postId;
        const dislikerEmail = req.body.disliker;
        const likes = req.body.likes;
        const dislikes = req.body.dislikes;
        if (!postId || !dislikerEmail)
            return res.status(400).json("There has been an error in the request");
        if (Number(dislikes) < 1)
            await CommentModel.findOneAndUpdate({ _id: postId }, { dislikes: [dislikerEmail] });
        else {
            await CommentModel.findOneAndUpdate(
                { _id: postId },
                { $addToSet: { dislikes: dislikerEmail } }
            );
        }
        if (Number(likes) >= 1)
            await CommentModel.findOneAndUpdate({ _id: postId }, { $pull: { likes: dislikerEmail } });
        const post = await CommentModel.findOne({ _id: postId }, { __v: 0 });
        if (!post) return res.status(400).json("There has been an error in the request");
        const totalLikes = post.likes[0] == "0" ? 0 : post.likes.length;
        const totalDislikes = post.dislikes.length++;
        res.status(201).json({ likes: totalLikes, dislikes: totalDislikes });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const postUnreactComment = async (req: Request, res: Response) => {
    try {
        const postId = req.body.postId;
        const unreacterEmail = req.body.disliker;
        const reaction = req.body.reaction;
        if (!postId || !unreacterEmail)
            return res.status(400).json("There has been an error in the request");
        if (reaction === "like")
            await CommentModel.findOneAndUpdate({ _id: postId }, { $pull: { likes: unreacterEmail } });
        if (reaction === "dislike")
            await CommentModel.findOneAndUpdate(
                { _id: postId },
                { $pull: { dislikes: unreacterEmail } }
            );
        const post = await CommentModel.findOne({ _id: postId }, { __v: 0 });
        if (!post) return res.status(400).json("There has been an error in the request");
        const totalLikes = post.likes.length;
        const totalDislikes = post.dislikes.length;
        res.status(201).json({ likes: totalLikes, dislikes: totalDislikes });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
