import { IComment } from "interfaces";
import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
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
    idFromPost: {
        type: String,
        required: true
    }
});

const CommentModel = model<IComment>("comment", CommentSchema);

export { CommentModel, CommentSchema };
