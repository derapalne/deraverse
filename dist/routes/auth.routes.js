"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.authRouter = router;
const controllers_1 = require("../controllers");
const jwt_auth_1 = require("../middlewares/jwt-auth");
router.post("/signup", jwt_auth_1.isNotAuth, controllers_1.postSignUp);
router.post("/signin", jwt_auth_1.isNotAuth, controllers_1.postSignIn);
router.post("/logout", jwt_auth_1.isAuth, controllers_1.postLogOut);
//# sourceMappingURL=auth.routes.js.map