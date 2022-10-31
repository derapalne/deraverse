import { Router } from "express";
import { isRegularExpressionLiteral } from "typescript";

const router: Router = Router();

import {
    getMain,
    getSignUp,
    getSignIn,
    getUsersNotFollowed,
    postAddFriend,
    getUserProfile,
    postChangeUserAvatar,
} from "../controllers";
import { isAuth, isNotAuth } from "../middlewares/jwt-auth";

router.get("/signup", isNotAuth, getSignUp);
router.get("/signin", isNotAuth, getSignIn);
router.get("/main", isAuth, getMain);
router.get("/profiles/:useremail", isAuth, getUserProfile);
router.get("/api/profiles/notfriends", isAuth, getUsersNotFollowed);
router.post("/api/profiles/addfriend", isAuth, postAddFriend);
router.post("/api/profiles/updatePfp", isAuth, postChangeUserAvatar);

export { router as userRouter };
