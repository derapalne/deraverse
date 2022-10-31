"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.postRouter = router;
const controllers_1 = require("../controllers");
const jwt_auth_1 = require("../middlewares/jwt-auth");
router.post("/api/post", jwt_auth_1.isAuth, controllers_1.postPost);
router.get("/api/post", jwt_auth_1.isAuth, controllers_1.getUserPosts);
router.get("/api/post/lastpublishedpost", jwt_auth_1.isAuth, controllers_1.getLastPublishedPost);
router.get("/api/post/friendsposts", jwt_auth_1.isAuth, controllers_1.getAllFriendsPosts);
router.post("/api/post/likepost", jwt_auth_1.isAuth, controllers_1.postLikePost);
router.post("/api/post/dislikepost", jwt_auth_1.isAuth, controllers_1.postDislikePost);
router.post("/api/post/unreactpost", jwt_auth_1.isAuth, controllers_1.postUnreactPost);
//# sourceMappingURL=post.routes.js.map