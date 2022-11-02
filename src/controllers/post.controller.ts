import { Request, Response } from "express";
import { IComment, IPost } from "../interfaces";
import { PostModel, UserModel } from "../models";
import { getCommentsFromPost } from "./comment.controller";

type FullPost = {
    post: {
        content: IPost;
        comments: { comment: IComment; status: number; authorAvatar: string }[];
    };
    status: number;
    authorAvatar: string;
};

export const postPost = async (req: Request, res: Response) => {
    const author: string = req.body.author;
    const content: string = req.body.content;
    const date: string = req.body.date;
    const timestamp: number = req.body.timestamp;
    const user = await UserModel.findOne({ email: author }, { username: 1 });
    if (!user) return res.status(400).json("There has been an error within your request");
    const post: IPost = new PostModel({
        author: author,
        username: user.username,
        content: content,
        date: date,
        timestamp: timestamp,
        likes: [],
        dislikes: [],
    });
    const savedPost = await post.save();
    res.status(201).json({ post: savedPost, status: 0 });
};

export const getLastPublishedPost = async (req: Request, res: Response) => {
    const authorEmail = req.query.user;
    if (!authorEmail) return res.status(404).json("There has been an error in the request");
    const lastPost = await PostModel.findOne({ author: authorEmail }).sort({ timestamp: -1 }).limit(1);
    const author = await UserModel.findOne({ email: authorEmail }, { avatar: 1 });
    const authorAvatar = author ? author.avatar : "/img/default-avatar.png";
    if(!lastPost) return res.status(500).json("Couldnt retrieve post"); 
    lastPost.likes.push("0");
    lastPost.dislikes.push("0");
    const postToSend: FullPost = {
        post: {
            content: lastPost,
            comments: []
        },
        status: 0,
        authorAvatar: authorAvatar
    }
    res.status(200).json(postToSend);
};

const getPostsFromFriendlist = async (
    friendlist: string[],
    userEmail: string,
    timestamp: number
): Promise<FullPost[]> => {
    // Crear el array donde van a estar los posts
    const postsToShow: FullPost[] = [];
    // Por cada item del array de amigos, siempre y cuando sean menos de diez posts
    let index = 0;
    const publishedPostsIds: string[] = [];
    while (index < 10) {
        // Buscá los posts de cada amigo de la lista
        const friendPosts = await PostModel.find(
            { author: { $in: friendlist }, timestamp: { $lt: timestamp } },
            { __v: 0 }
        )
            .sort("-timestamp")
            .limit(10);
        if(friendPosts.length == 0) break;
        for (let p = 0; p < friendPosts.length; p++) {
            let status = 0;
            const liked = friendPosts[p].likes.find((user) => user == userEmail);
            const disliked = friendPosts[p].dislikes.find((user) => user == userEmail);
            if (liked) status = 1;
            else if (disliked) {
                status = 2;
            }
            // Traé su avatar
            const friendAvatar = await UserModel.findOne(
                { email: friendPosts[p].author },
                { avatar: 1, _id: 0 }
            );
            let authorAvatar = "/img/default-avatar.png";
            if (friendAvatar) authorAvatar = friendAvatar.avatar;
            const comments = await getCommentsFromPost(`${friendPosts[p].author}-${friendPosts[p].timestamp}`, userEmail, Date.now());
            const wasPublished = publishedPostsIds.find((id: string) => id == friendPosts[p].id);
            if (wasPublished) {
                index = 10;
                continue;
            } else publishedPostsIds.push(friendPosts[p].id);
            postsToShow.push({
                post: { content: friendPosts[p], comments: comments },
                status: status,
                authorAvatar: authorAvatar,
            });
            index++;
            if (index >= 10) break;
        }
        if (index >= 10) break;
    }
    return postsToShow;
};

export const getAllFriendsPosts = async (req: Request, res: Response) => {
    const timestamp = req.query.timestamp?.toString();
    const userEmail = req.query.user?.toString();
    if (!userEmail || !timestamp)
        return res.status(400).json("There has been an error in the request");
    const usersFriendlist = await UserModel.findOne(
        { email: userEmail },
        { friendlist: 1, _id: 0 }
    );
    if (!usersFriendlist) return res.status(400).json("There has been an error in the request");
    const postsToShow: FullPost[] = await getPostsFromFriendlist(
        usersFriendlist.friendlist,
        userEmail,
        parseInt(timestamp)
    );
    if(postsToShow.length > 0) return res.status(200).json(postsToShow);
    else return res.status(200).json(false);
};

export const getUserPosts = async (req: Request, res: Response) => {
    const profileEmail = req.query.profileEmail?.toString();
    const userEmail = req.query.userEmail?.toString();
    const timestamp = req.query.timestamp?.toString();
    if (!profileEmail || !userEmail || !timestamp)
        return res.status(403).json("There has been an error in the request");
    const posts: FullPost[] = await getPostsFromFriendlist([profileEmail], userEmail, parseInt(timestamp));
    res.status(200).json(posts);
};

export const postLikePost = async (req: Request, res: Response) => {
    try {
        const postId = req.body.postId;
        const likerEmail = req.body.liker;
        const likes = req.body.likes;
        const dislikes = req.body.dislikes;
        if (!postId || !likerEmail)
            return res.status(400).json("There has been an error in the request");
        if (Number(likes) < 1)
            await PostModel.findOneAndUpdate({ _id: postId }, { likes: [likerEmail] });
        else {
            await PostModel.findOneAndUpdate({ _id: postId }, { $addToSet: { likes: likerEmail } });
        }
        if (Number(dislikes) >= 1)
            await PostModel.findOneAndUpdate({ _id: postId }, { $pull: { dislikes: likerEmail } });
        const post = await PostModel.findOne({ _id: postId }, { __v: 0 });
        if (!post) return res.status(400).json("There has been an error in the request");
        const totalLikes = post.likes.length++;
        const totalDislikes = post.dislikes[0] == "0" ? 0 : post.dislikes.length;
        res.status(201).json({ likes: totalLikes, dislikes: totalDislikes });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const postDislikePost = async (req: Request, res: Response) => {
    try {
        const postId = req.body.postId;
        const dislikerEmail = req.body.disliker;
        const likes = req.body.likes;
        const dislikes = req.body.dislikes;
        if (!postId || !dislikerEmail)
            return res.status(400).json("There has been an error in the request");
        if (Number(dislikes) < 1)
            await PostModel.findOneAndUpdate({ _id: postId }, { dislikes: [dislikerEmail] });
        else {
            await PostModel.findOneAndUpdate(
                { _id: postId },
                { $addToSet: { dislikes: dislikerEmail } }
            );
        }
        if (Number(likes) >= 1)
            await PostModel.findOneAndUpdate({ _id: postId }, { $pull: { likes: dislikerEmail } });
        const post = await PostModel.findOne({ _id: postId }, { __v: 0 });
        if (!post) return res.status(400).json("There has been an error in the request");
        const totalLikes = post.likes[0] == "0" ? 0 : post.likes.length;
        const totalDislikes = post.dislikes.length++;
        res.status(201).json({ likes: totalLikes, dislikes: totalDislikes });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const postUnreactPost = async (req: Request, res: Response) => {
    try {
        const postId = req.body.postId;
        const unreacterEmail = req.body.disliker;
        const reaction = req.body.reaction;
        if (!postId || !unreacterEmail)
            return res.status(400).json("There has been an error in the request");
        if (reaction === "like")
            await PostModel.findOneAndUpdate({ _id: postId }, { $pull: { likes: unreacterEmail } });
        if (reaction === "dislike")
            await PostModel.findOneAndUpdate(
                { _id: postId },
                { $pull: { dislikes: unreacterEmail } }
            );
        const post = await PostModel.findOne({ _id: postId }, { __v: 0 });
        if (!post) return res.status(400).json("There has been an error in the request");
        const totalLikes = post.likes.length;
        const totalDislikes = post.dislikes.length;
        res.status(201).json({ likes: totalLikes, dislikes: totalDislikes });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
