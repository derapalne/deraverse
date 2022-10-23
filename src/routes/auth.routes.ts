import { Router } from "express";

const router: Router = Router();

import { postSignUp, postSignIn, postLogOut } from "../controllers";
import { isAuth, isNotAuth } from "../middlewares/jwt-auth";

router.post("/signup", isNotAuth, postSignUp);
router.post("/signin", isNotAuth, postSignIn);
router.post("/logout", isAuth, postLogOut);

export { router as authRouter };
