"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = exports.postRouter = exports.userRouter = exports.authRouter = void 0;
var auth_routes_1 = require("./auth.routes");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return auth_routes_1.authRouter; } });
var user_routes_1 = require("./user.routes");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return user_routes_1.userRouter; } });
var post_routes_1 = require("./post.routes");
Object.defineProperty(exports, "postRouter", { enumerable: true, get: function () { return post_routes_1.postRouter; } });
var comment_routes_1 = require("./comment.routes");
Object.defineProperty(exports, "commentRouter", { enumerable: true, get: function () { return comment_routes_1.commentRouter; } });
//# sourceMappingURL=index.js.map