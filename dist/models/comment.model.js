"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
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
exports.CommentSchema = CommentSchema;
const CommentModel = (0, mongoose_1.model)("comment", CommentSchema);
exports.CommentModel = CommentModel;
//# sourceMappingURL=comment.model.js.map