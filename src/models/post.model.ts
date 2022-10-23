import { Schema, model } from "mongoose";
import { IPost } from "interfaces";

const PostSchema = new Schema({
    author: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    likes: {
        type: [String],
        required: true,
    },
    dislikes: {
        type: [String],
        required: true,
    },
});

const PostModel = model<IPost>("post", PostSchema);

export { PostModel, PostSchema };
