import { Router } from "express";

const router: Router = Router();

import {
    postPostComment,
} from "../controllers";
import { isAuth } from "../middlewares/jwt-auth";

router.post("/api/comment", isAuth, postPostComment);


export { router as commentRouter };