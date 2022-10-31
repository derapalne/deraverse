"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
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
exports.PostSchema = PostSchema;
const PostModel = (0, mongoose_1.model)("post", PostSchema);
exports.PostModel = PostModel;
//# sourceMappingURL=post.model.js.map