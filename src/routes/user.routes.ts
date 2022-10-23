import { Router } from "express";

const router: Router = Router();

import { getProfile, getSignUp, getSignIn, getUsersNotFriends, postAddFriend } from "../controllers";
import { isAuth, isNotAuth } from "../middlewares/jwt-auth";

router.get("/signup", isNotAuth, getSignUp);
router.get("/signin", isNotAuth, getSignIn);
router.get("/main", isAuth, getProfile);
router.get("/api/profiles/notfriends", isAuth, getUsersNotFriends);
router.post("/api/profiles/addfriend", isAuth, postAddFriend);

export { router as userRouter };
