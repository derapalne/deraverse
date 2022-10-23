import { Router } from "express";

const router: Router = Router();

import {
    postPost,
    getLastPublishedPost,
    getAllFriendsPosts,
    postLikePost,
    postDislikePost,
    postUnreactPost,
    getUserPosts,
} from "../controllers";
import { isAuth } from "../middlewares/jwt-auth";

router.post("/api/post", isAuth, postPost);
router.get("/api/post", isAuth, getUserPosts);
router.get("/api/post/lastpublishedpost", isAuth, getLastPublishedPost);
router.get("/api/post/friendsposts", isAuth, getAllFriendsPosts);
router.post("/api/post/likepost", isAuth, postLikePost);
router.post("/api/post/dislikepost", isAuth, postDislikePost);
router.post("/api/post/unreactpost", isAuth, postUnreactPost);

export { router as postRouter };
