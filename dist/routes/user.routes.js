"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.userRouter = router;
const controllers_1 = require("../controllers");
const jwt_auth_1 = require("../middlewares/jwt-auth");
router.get("/signup", jwt_auth_1.isNotAuth, controllers_1.getSignUp);
router.get("/signin", jwt_auth_1.isNotAuth, controllers_1.getSignIn);
router.get("/main", jwt_auth_1.isAuth, controllers_1.getMain);
router.get("/profiles/:useremail", jwt_auth_1.isAuth, controllers_1.getUserProfile);
router.get("/api/profiles/notfriends", jwt_auth_1.isAuth, controllers_1.getUsersNotFollowed);
router.post("/api/profiles/addfriend", jwt_auth_1.isAuth, controllers_1.postAddFriend);
router.post("/api/profiles/updatePfp", jwt_auth_1.isAuth, controllers_1.postChangeUserAvatar);
//# sourceMappingURL=user.routes.js.map